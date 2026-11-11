-- =====================================================================================================
-- KITEBud showcase payment (MVP): PROPOSED MIGRATION, revision 4. TEST SUPABASE PROJECT ONLY.
-- Not applied anywhere yet. Manual ABA KHQR check: a student creates a request, one of two staff
-- members checks the money really arrived in ABA, then approves or rejects it.
--
-- READ BEFORE APPLYING
-- 1. Durations
--    · Pending window: 20 minutes. After it the student's screen shows "expired" and the request stops
--      counting toward the 3-open-requests limit. Staff can STILL approve or reject it (a student may have
--      paid on time while staff checked late).
--      Where: the default of column pending_expires_at below.
--      Change after applying:
--        alter table public.payment_requests alter column pending_expires_at set default now() + interval '30 minutes';
--    · Paid session: 2 hours from the moment of approval.
--      Where: "interval '2 hours'" in approve_payment below. Change it there and re-run that create or replace.
--    · The website's settings (js/config.js) only DISPLAY these durations. The database is what counts,
--      so keep the two in step.
-- 2. Removing a staff member
--    Staff = app_metadata.kitebud_role = 'payment_staff', read from the login token. Removing the role (or
--    deleting the user) takes effect only when that person's current login token expires: up to 1 hour
--    with Supabase's default token lifetime. To lock someone out at once, ALSO change their password and
--    sign them out of all sessions in the dashboard; the old token still works until it expires.
-- 3. Flood guard
--    At most 300 new requests per 5 minutes across the whole site, and at most 3 open (pending, not
--    expired) requests per visitor code. When the limit is hit the STUDENT sees "too many requests, please
--    try again shortly" (error code 54000). Staff see nothing special: no new rows arrive. Someone holding
--    the public key could fill the 300 on purpose and block real students for up to 5 minutes; we accept
--    that for a one-day showcase.
--    The per-visitor limit only keeps one honest student's requests tidy: anyone can bypass it by making
--    up new visitor codes, so the overall limit of 300 per 5 minutes is the real flood guard. Because made-up
--    codes can fill the list, the staff dashboard must let staff search by visitor code.
-- 4. Accepted MVP limitation
--    Scoring and the report run in the student's browser. This database decides who has PAID, but the
--    gate itself runs in the browser, so a technically skilled student can bypass it. It is a gate for the
--    ordinary student journey, not server-enforced payment protection. Do not describe it as fully secure.
-- 5. Who decided, after a staff account is deleted
--    verified_by points at the staff login and becomes empty (NULL) if that account is deleted, so deleting
--    a staff account never fails or removes payment records. verified_by_email is a plain copy of the
--    staff email taken at the moment of the decision: it keeps the record of who approved or rejected.
--    Approved requests stay valid after the staff account is deleted, because the approved_is_complete
--    rule checks verified_by_email, not verified_by. approve_payment refuses a staff login with no email.
-- =====================================================================================================

-- 0. Needed for the random secret and its hash (already on in new Supabase projects; harmless if so) ----
create extension if not exists pgcrypto with schema extensions;
-- stop with a clear message if pgcrypto lives in another schema (the functions below call extensions.*)
do $$
begin
  if not exists (select 1 from pg_catalog.pg_extension e
                   join pg_catalog.pg_namespace n on n.oid = e.extnamespace
                  where e.extname = 'pgcrypto' and n.nspname = 'extensions') then
    raise exception 'pgcrypto is not installed in the "extensions" schema. Stop here and tell the developer.';
  end if;
end $$;

-- 1. Table ------------------------------------------------------------------------------------------
-- Status stored in the table: pending, approved, rejected. "expired" is never stored: it is what the
-- student is shown for a pending request past pending_expires_at, so staff can still approve it.
create table public.payment_requests (
  id                    uuid        primary key default gen_random_uuid(),
  visitor_code          text        not null check (visitor_code ~ '^KT-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$'), -- the KT code from js/app.js genId()
  session_token_hash    text        not null,                                   -- sha256 of the secret the student's browser holds
  amount_khr            integer     not null default 3000 check (amount_khr = 3000),
  currency              text        not null default 'KHR' check (currency = 'KHR'),
  status                text        not null default 'pending' check (status in ('pending','approved','rejected')),
  transaction_reference text        check (transaction_reference is null or char_length(transaction_reference) between 4 and 64),
  verified_by           uuid        references auth.users(id) on delete set null, -- staff who approved or rejected (see note 5)
  verified_by_email     text,                                                   -- shown on the dashboard (auth.users is not readable from the browser)
  verified_at           timestamptz,
  reject_reason         text        check (reject_reason is null or char_length(reject_reason) <= 200),
  created_at            timestamptz not null default now(),
  pending_expires_at    timestamptz not null default now() + interval '20 minutes',  -- see note 1
  session_expires_at    timestamptz,                                                 -- paid-session end, set on approval
  constraint approved_is_complete check (status <> 'approved'
    or (transaction_reference is not null and verified_by_email is not null and verified_at is not null and session_expires_at is not null))
);
-- one ABA transaction can unlock only one request (case and spaces ignored)
create unique index payment_requests_txn_ref_unique on public.payment_requests (upper(btrim(transaction_reference)))
  where transaction_reference is not null;
create index payment_requests_status_created on public.payment_requests (status, created_at desc);

-- 2. Access: nobody writes the table directly; only staff can read it, and never the token hash -------
alter table public.payment_requests enable row level security;
revoke all on table public.payment_requests from public, anon, authenticated;  -- Supabase grants new tables to anon/authenticated by default
-- logged-in users may read every column EXCEPT session_token_hash; the policy below limits rows to staff
grant select (id, visitor_code, amount_khr, currency, status, transaction_reference, verified_by, verified_by_email,
              verified_at, reject_reason, created_at, pending_expires_at, session_expires_at)
  on table public.payment_requests to authenticated;

-- staff = a role in app_metadata, which users cannot set themselves (sign-ups are ON in production,
-- so "logged in" alone must never mean staff)
create or replace function public.is_payment_staff()
returns boolean language sql stable set search_path = ''
as $$ select coalesce((auth.jwt() -> 'app_metadata' ->> 'kitebud_role') = 'payment_staff', false) $$;

create policy payment_requests_staff_read on public.payment_requests
  for select to authenticated using (public.is_payment_staff());

-- 3. Student operations (public key) ----------------------------------------------------------------
-- creates a request and returns its id plus a one-time secret; only the hash is stored
create or replace function public.create_payment_request(p_visitor_code text)
returns table (request_id uuid, session_token text, pending_expires_at timestamptz)
language plpgsql security definer set search_path = ''
as $$
declare v_token text; v_id uuid; v_exp timestamptz;
begin
  if p_visitor_code is null or p_visitor_code !~ '^KT-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$' then
    raise exception 'invalid visitor code' using errcode = '22023';
  end if;
  -- flood guard for a one-day event (note 3)
  if (select count(*) from public.payment_requests pr where pr.created_at > now() - interval '5 minutes') >= 300 then
    raise exception 'too many requests, please try again shortly' using errcode = '54000';
  end if;
  -- one student cannot pile up open requests; expired ones no longer count
  if (select count(*) from public.payment_requests pr
       where pr.visitor_code = p_visitor_code and pr.status = 'pending' and pr.pending_expires_at > now()) >= 3 then
    raise exception 'too many open requests for this visitor code' using errcode = '54000';
  end if;
  v_token := encode(extensions.gen_random_bytes(32), 'hex');
  insert into public.payment_requests (visitor_code, session_token_hash)
  values (p_visitor_code, encode(extensions.digest(v_token, 'sha256'), 'hex'))
  returning payment_requests.id, payment_requests.pending_expires_at into v_id, v_exp;
  return query select v_id, v_token, v_exp;
end $$;

-- status only, and only with the matching secret (a visitor code or request id alone returns nothing).
-- Read-only: "expired" is worked out here for display and never written, so staff can still approve.
create or replace function public.get_payment_status(p_request_id uuid, p_session_token text)
returns table (status text, access_granted boolean, pending_expires_at timestamptz, session_expires_at timestamptz)
language sql stable security definer set search_path = ''
as $$
  select case when pr.status = 'pending' and pr.pending_expires_at <= now() then 'expired' else pr.status end,
         (pr.status = 'approved' and pr.session_expires_at > now()),
         pr.pending_expires_at,
         pr.session_expires_at
    from public.payment_requests pr
   where pr.id = p_request_id
     and pr.session_token_hash = encode(extensions.digest(coalesce(p_session_token, ''), 'sha256'), 'hex')
$$;

-- 4. Staff operations ----------------------------------------------------------------------------------
-- Any request whose stored status is 'pending' can be approved or rejected, even after its 20 minutes.
create or replace function public.approve_payment(p_request_id uuid, p_transaction_reference text)
returns table (request_id uuid, status text, verified_at timestamptz, session_expires_at timestamptz)
language plpgsql security definer set search_path = ''
as $$
declare v_ref text := upper(btrim(coalesce(p_transaction_reference, ''))); r public.payment_requests;
begin
  if not public.is_payment_staff() then raise exception 'not authorized' using errcode = '42501'; end if;
  if coalesce(btrim(auth.jwt() ->> 'email'), '') = '' then raise exception 'staff login has no email' using errcode = '42501'; end if;
  if char_length(v_ref) < 4 then raise exception 'ABA transaction reference required' using errcode = '22023'; end if;
  -- atomic: only a pending request can change, so two staff pressing Approve at once
  -- produce one approval and one "already approved" error
  update public.payment_requests pr
     set status = 'approved', transaction_reference = v_ref, verified_by = auth.uid(),
         verified_by_email = auth.jwt() ->> 'email', verified_at = now(),
         session_expires_at = now() + interval '2 hours'                       -- note 1
   where pr.id = p_request_id and pr.status = 'pending'
  returning pr.* into r;
  if not found then
    select * into r from public.payment_requests pr where pr.id = p_request_id;
    if not found then raise exception 'request not found' using errcode = 'P0002'; end if;
    raise exception 'request already %', r.status using errcode = '22023';
  end if;
  return query select r.id, r.status, r.verified_at, r.session_expires_at;
exception when unique_violation then
  raise exception 'this ABA transaction reference was already used' using errcode = '23505';
end $$;

create or replace function public.reject_payment(p_request_id uuid, p_reason text)
returns table (request_id uuid, status text, verified_at timestamptz)
language plpgsql security definer set search_path = ''
as $$
declare v_reason text := left(nullif(btrim(coalesce(p_reason, '')), ''), 200); r public.payment_requests;
begin
  if not public.is_payment_staff() then raise exception 'not authorized' using errcode = '42501'; end if;
  if v_reason is null then raise exception 'rejection reason required' using errcode = '22023'; end if;
  update public.payment_requests pr
     set status = 'rejected', reject_reason = v_reason,
         verified_by = auth.uid(), verified_by_email = auth.jwt() ->> 'email', verified_at = now()
   where pr.id = p_request_id and pr.status = 'pending'
  returning pr.* into r;
  if not found then
    select * into r from public.payment_requests pr where pr.id = p_request_id;
    if not found then raise exception 'request not found' using errcode = 'P0002'; end if;
    raise exception 'request already %', r.status using errcode = '22023';
  end if;
  return query select r.id, r.status, r.verified_at;
end $$;

-- 5. Who may call what ------------------------------------------------------------------------------
-- Supabase grants every new function in "public" to anon and authenticated BY NAME (default privileges),
-- so revoking from "public" alone is not enough: revoke from all three, then grant back exactly.
revoke all on function public.is_payment_staff()                     from public, anon, authenticated;
revoke all on function public.create_payment_request(text)           from public, anon, authenticated;
revoke all on function public.get_payment_status(uuid, text)         from public, anon, authenticated;
revoke all on function public.approve_payment(uuid, text)            from public, anon, authenticated;
revoke all on function public.reject_payment(uuid, text)             from public, anon, authenticated;
grant execute on function public.is_payment_staff()                  to authenticated;  -- used by the read policy
grant execute on function public.create_payment_request(text)        to anon, authenticated;
grant execute on function public.get_payment_status(uuid, text)      to anon, authenticated;
grant execute on function public.approve_payment(uuid, text)         to authenticated;  -- checked inside: staff role only
grant execute on function public.reject_payment(uuid, text)          to authenticated;  -- checked inside: staff role only

-- 6. Live updates for the staff dashboard ---------------------------------------------------------------
-- Adds exactly ONE table, public.payment_requests, to the supabase_realtime publication. Nothing else.
-- Realtime sends a change only to subscribers whose read policy allows that row (staff only); anon has no
-- read grant at all. The staff dashboard uses Realtime as a "something changed" signal and then re-reads
-- the list with an explicit column list that leaves out session_token_hash (it has no right to read it).
alter publication supabase_realtime add table public.payment_requests;

-- =====================================================================================================
-- ROLLBACK (test project only). Every line is commented out on purpose: running this whole file can
-- never remove anything. To undo, copy these lines to a NEW query, remove the leading "-- " and run them.
-- alter publication supabase_realtime drop table public.payment_requests;
-- drop function public.reject_payment(uuid, text);
-- drop function public.approve_payment(uuid, text);
-- drop function public.get_payment_status(uuid, text);
-- drop function public.create_payment_request(text);
-- drop table public.payment_requests;
-- drop function public.is_payment_staff();
-- =====================================================================================================
