-- =====================================================================================================
-- KITEBud showcase payment: SECURITY TESTS for 01_payment_requests.sql (revision 4). TEST PROJECT ONLY.
--
-- Needs: 01 applied in the TEST project, and two staff test accounts that already exist in
-- Authentication with app_metadata {"kitebud_role":"payment_staff"}. Put their emails on the two lines
-- marked EDIT HERE (the first lines inside DECLARE below). Change nothing else.
-- T29 also inserts and then deletes a temporary user in auth.users (tmp-staff@kitebud-test.invalid),
-- so the SQL Editor's role must be allowed to do that; the final error undoes it like everything else.
--
-- How it leaves nothing behind:
--   The whole file is ONE statement (a DO block), and Postgres runs one statement as one transaction.
--   The block always ENDS WITH A DELIBERATE ERROR that carries the results, and an error undoes everything
--   the statement did: every test row, every role switch. There is no BEGIN/ROLLBACK because the error
--   alone does that job, whatever the SQL Editor does with transactions. The error also makes the results
--   visible, because the Supabase SQL Editor may not show NOTICE messages.
--
-- Expected result: a red error box that starts
--   "KITEBud payment tests finished: 30 PASS, 0 FAIL"
-- followed by one PASS line per test. Any other first line (for example "Replace STAFF_A_EMAIL…")
-- means the tests did not run to the end; nothing was kept in that case either.
-- =====================================================================================================
do $$
declare
  e1 text := 'STAFF_A_EMAIL';  -- EDIT HERE
  e2 text := 'STAFF_B_EMAIL';  -- EDIT HERE
  orig text := current_user::text;            -- the SQL Editor's own role, used for owner-only steps
  anon_claims text := '{"role":"anon"}';
  nonstaff text := '{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated","app_metadata":{}}';
  staff1 text; staff2 text; s1 uuid; s2 uuid;
  r1 uuid; t1 text; r2 uuid; t2 text; r3 uuid; t3 text; r4 uuid; r5 uuid; r6 uuid; r7 uuid;
  s3 uuid; staff3 text; vb uuid; ve text; r8 uuid; noemail text;
  n int; v text; st record; ok boolean; res text := ''; passes int; fails int;
begin
  -- preconditions ------------------------------------------------------------------------------------
  if e1 in ('STAFF_A_EMAIL', '') or e2 in ('STAFF_B_EMAIL', '') then
    raise exception 'Replace STAFF_A_EMAIL and STAFF_B_EMAIL at the top of this file first';
  end if;
  select id into s1 from auth.users where email = e1 and raw_app_meta_data ->> 'kitebud_role' = 'payment_staff';
  select id into s2 from auth.users where email = e2 and raw_app_meta_data ->> 'kitebud_role' = 'payment_staff';
  if s1 is null or s2 is null then
    raise exception 'Staff test accounts not found, or missing kitebud_role = payment_staff: %, %', e1, e2;
  end if;
  -- the login tokens those two accounts would carry (role and claims are set only inside this transaction)
  staff1 := json_build_object('sub', s1, 'email', e1, 'role', 'authenticated', 'app_metadata', json_build_object('kitebud_role', 'payment_staff'))::text;
  staff2 := json_build_object('sub', s2, 'email', e2, 'role', 'authenticated', 'app_metadata', json_build_object('kitebud_role', 'payment_staff'))::text;

  -- STUDENT (public key = role anon) ---------------------------------------------------------------
  perform set_config('role', 'anon', true); perform set_config('request.jwt.claims', anon_claims, true);

  select request_id, session_token into r1, t1 from public.create_payment_request('KT-ABCD-2345');
  ok := r1 is not null and length(t1) = 64;
  res := res || case when ok then 'PASS' else 'FAIL' end || ' T1 student creates a request (64-character secret returned)' || E'\n';

  begin perform 1 from public.payment_requests; ok := false;
  exception when insufficient_privilege then ok := true; end;
  res := res || case when ok then 'PASS' else 'FAIL' end || ' T2 student cannot read the table' || E'\n';

  begin update public.payment_requests set status = 'approved'; ok := false;
  exception when insufficient_privilege then ok := true; end;
  res := res || case when ok then 'PASS' else 'FAIL' end || ' T3 student cannot change a status directly' || E'\n';

  begin perform public.approve_payment(r1, 'X-1234'); ok := false;
  exception when insufficient_privilege then ok := true; end;
  res := res || case when ok then 'PASS' else 'FAIL' end || ' T4 student cannot call approve_payment' || E'\n';

  select count(*) into n from public.get_payment_status(r1, repeat('0', 64));
  ok := n = 0;
  select count(*) into n from public.get_payment_status(r1, null);
  ok := ok and n = 0;
  res := res || case when ok then 'PASS' else 'FAIL' end || ' T5 wrong or missing secret returns nothing (request id alone authorizes nothing)' || E'\n';

  select * into st from public.get_payment_status(r1, t1);
  ok := st.status = 'pending' and not st.access_granted;
  res := res || case when ok then 'PASS' else 'FAIL' end || ' T6 right secret: pending, no access' || E'\n';

  begin perform public.create_payment_request('KT-DEMO-0000'); ok := false;
  exception when invalid_parameter_value then ok := true; end;
  res := res || case when ok then 'PASS' else 'FAIL' end || ' T7 invalid visitor code rejected (the sample ID KT-DEMO-0000 cannot pay)' || E'\n';

  -- LOGGED IN BUT NOT STAFF (sign-ups are on in production) -----------------------------------------
  perform set_config('role', 'authenticated', true); perform set_config('request.jwt.claims', nonstaff, true);

  begin perform public.approve_payment(r1, 'X-1234'); ok := false;
  exception when insufficient_privilege then ok := true; end;
  res := res || case when ok then 'PASS' else 'FAIL' end || ' T8 a logged-in non-staff user cannot approve' || E'\n';

  select count(id) into n from public.payment_requests;
  ok := n = 0;
  res := res || case when ok then 'PASS' else 'FAIL' end || ' T9 a logged-in non-staff user sees 0 rows' || E'\n';

  -- STAFF ------------------------------------------------------------------------------------------
  perform set_config('request.jwt.claims', staff1, true);

  select count(id) into n from public.payment_requests;
  ok := n >= 1;
  res := res || case when ok then 'PASS' else 'FAIL' end || ' T10 staff sees the requests' || E'\n';

  select status into v from public.approve_payment(r1, ' test-ref-001 ');
  ok := v = 'approved';
  res := res || case when ok then 'PASS' else 'FAIL' end || ' T11 staff A approves with an ABA reference' || E'\n';

  perform set_config('request.jwt.claims', staff2, true);
  begin perform public.approve_payment(r1, 'TEST-REF-999'); ok := false;
  exception when invalid_parameter_value then ok := sqlerrm = 'request already approved'; end;
  res := res || case when ok then 'PASS' else 'FAIL' end || ' T12 a second approval of the same request is refused' || E'\n';

  perform set_config('role', 'anon', true); perform set_config('request.jwt.claims', anon_claims, true);
  select request_id, session_token into r2, t2 from public.create_payment_request('KT-WXYZ-6789');
  perform set_config('role', 'authenticated', true); perform set_config('request.jwt.claims', staff2, true);

  begin perform public.approve_payment(r2, 'TEST-REF-001'); ok := false;   -- same reference as T11, different case
  exception when unique_violation then ok := true; end;
  res := res || case when ok then 'PASS' else 'FAIL' end || ' T13 the same ABA reference cannot unlock a second request' || E'\n';

  select status into v from public.reject_payment(r2, 'amount did not arrive');
  ok := v = 'rejected';
  res := res || case when ok then 'PASS' else 'FAIL' end || ' T14 staff B rejects' || E'\n';

  perform set_config('request.jwt.claims', staff1, true);
  begin perform public.approve_payment(r2, 'TEST-REF-555'); ok := false;
  exception when invalid_parameter_value then ok := sqlerrm = 'request already rejected'; end;
  res := res || case when ok then 'PASS' else 'FAIL' end || ' T26 a rejected request cannot be approved' || E'\n';

  -- REQUIRED INPUT: ABA reference (4+ characters) and rejection reason ------------------------------
  perform set_config('role', 'anon', true); perform set_config('request.jwt.claims', anon_claims, true);
  select request_id into r5 from public.create_payment_request('KT-QRST-2345');
  select request_id into r6 from public.create_payment_request('KT-UVWX-3456');
  perform set_config('role', 'authenticated', true); perform set_config('request.jwt.claims', staff1, true);

  ok := true;
  begin perform public.approve_payment(r5, '   '); ok := false;            -- blank
  exception when invalid_parameter_value then null; end;
  begin perform public.approve_payment(r5, ' ab1 '); ok := false;          -- 3 characters after trimming
  exception when invalid_parameter_value then null; end;
  select pr.status into v from public.payment_requests pr where pr.id = r5;
  ok := ok and v = 'pending';
  res := res || case when ok then 'PASS' else 'FAIL' end || ' T27 approve with a blank or 3-character ABA reference is refused; request stays pending' || E'\n';

  ok := true;
  begin perform public.reject_payment(r6, ''); ok := false;                -- empty
  exception when invalid_parameter_value then null; end;
  begin perform public.reject_payment(r6, '   '); ok := false;             -- whitespace only
  exception when invalid_parameter_value then null; end;
  select pr.status into v from public.payment_requests pr where pr.id = r6;
  ok := ok and v = 'pending';
  res := res || case when ok then 'PASS' else 'FAIL' end || ' T28 reject with an empty or whitespace-only reason is refused; request stays pending' || E'\n';

  -- STUDENT SEES APPROVAL --------------------------------------------------------------------------
  perform set_config('role', 'anon', true); perform set_config('request.jwt.claims', anon_claims, true);
  select * into st from public.get_payment_status(r1, t1);
  ok := st.status = 'approved' and st.access_granted
        and st.session_expires_at between now() + interval '119 minutes' and now() + interval '121 minutes';
  res := res || case when ok then 'PASS' else 'FAIL' end || ' T15 student sees approved + access for 2 hours' || E'\n';

  -- EXPIRY: the student sees "expired", staff can still decide -------------------------------------
  select request_id, session_token into r3, t3 from public.create_payment_request('KT-EFGH-2345');
  perform set_config('role', orig, true);                                   -- owner: move the clock back for r3
  update public.payment_requests set pending_expires_at = now() - interval '1 minute', created_at = now() - interval '21 minutes' where id = r3;
  perform set_config('role', 'anon', true);
  select * into st from public.get_payment_status(r3, t3);
  ok := st.status = 'expired' and not st.access_granted;
  res := res || case when ok then 'PASS' else 'FAIL' end || ' T16 student sees "expired" (no access) after 20 minutes' || E'\n';

  perform set_config('role', 'authenticated', true); perform set_config('request.jwt.claims', nonstaff, true);
  begin perform public.reject_payment(r3, 'x'); ok := false;
  exception when insufficient_privilege then ok := true; end;
  res := res || case when ok then 'PASS' else 'FAIL' end || ' T17 a logged-in non-staff user cannot reject' || E'\n';

  perform set_config('request.jwt.claims', staff1, true);
  select status into v from public.approve_payment(r3, 'TEST-REF-777');
  perform set_config('role', 'anon', true); perform set_config('request.jwt.claims', anon_claims, true);
  select * into st from public.get_payment_status(r3, t3);
  ok := v = 'approved' and st.status = 'approved' and st.access_granted;
  res := res || case when ok then 'PASS' else 'FAIL' end || ' T22 staff can approve a pending request after it expired; the student then gets access' || E'\n';

  -- LIMIT OF 3 OPEN REQUESTS PER VISITOR CODE ------------------------------------------------------
  for i in 1..3 loop perform public.create_payment_request('KT-LMNP-2345'); end loop;
  begin perform public.create_payment_request('KT-LMNP-2345'); ok := false;
  exception when program_limit_exceeded then ok := true; end;
  res := res || case when ok then 'PASS' else 'FAIL' end || ' T18 a 4th open request for one visitor code is refused' || E'\n';

  perform set_config('role', orig, true);                                   -- owner: expire those three
  update public.payment_requests set pending_expires_at = now() - interval '1 minute'
   where visitor_code = 'KT-LMNP-2345' and status = 'pending';
  perform set_config('role', 'anon', true);
  select request_id into r4 from public.create_payment_request('KT-LMNP-2345');
  ok := r4 is not null;
  res := res || case when ok then 'PASS' else 'FAIL' end || ' T23 expired requests do not count toward the limit of 3' || E'\n';

  -- READ ACCESS ------------------------------------------------------------------------------------
  begin perform 1 from public.payment_requests; ok := false;               -- still anon here
  exception when insufficient_privilege then ok := true; end;
  perform set_config('role', 'authenticated', true); perform set_config('request.jwt.claims', nonstaff, true);
  select count(id) into n from public.payment_requests;
  ok := ok and n = 0;
  res := res || case when ok then 'PASS' else 'FAIL' end || ' T24 anon cannot SELECT payment_requests; a logged-in non-staff user sees 0 rows' || E'\n';

  perform set_config('request.jwt.claims', staff1, true);
  begin perform pr.session_token_hash from public.payment_requests pr limit 1; ok := false;
  exception when insufficient_privilege then ok := true; end;
  ok := ok and not has_column_privilege('authenticated', 'public.payment_requests', 'session_token_hash', 'select');
  res := res || case when ok then 'PASS' else 'FAIL' end || ' T25 staff cannot read session_token_hash' || E'\n';

  -- STAFF LOGIN WITHOUT AN EMAIL -------------------------------------------------------------------
  noemail := json_build_object('sub', s1, 'role', 'authenticated', 'app_metadata', json_build_object('kitebud_role', 'payment_staff'))::text;
  perform set_config('role', 'anon', true); perform set_config('request.jwt.claims', anon_claims, true);
  select request_id into r8 from public.create_payment_request('KT-NPQR-2345');
  perform set_config('role', 'authenticated', true); perform set_config('request.jwt.claims', noemail, true);
  begin perform public.approve_payment(r8, 'TEST-REF-666'); ok := false;
  exception when insufficient_privilege then ok := sqlerrm = 'staff login has no email'; end;
  perform set_config('request.jwt.claims', staff1, true);
  select pr.status into v from public.payment_requests pr where pr.id = r8;
  ok := ok and v = 'pending';
  res := res || case when ok then 'PASS' else 'FAIL' end || ' T30 a staff login with no email cannot approve; request stays pending' || E'\n';

  -- STAFF ACCOUNT DELETED AFTER APPROVING ----------------------------------------------------------
  perform set_config('role', orig, true);
  begin
    insert into auth.users (id, email, raw_app_meta_data)
    values (gen_random_uuid(), 'tmp-staff@kitebud-test.invalid', '{"kitebud_role":"payment_staff"}'::jsonb)
    returning id into s3;
  exception when others then   -- report it, do not work around it
    raise exception 'T29 setup: could not insert a throwaway user into auth.users (needs more columns?): % (%)', sqlerrm, sqlstate;
  end;
  staff3 := json_build_object('sub', s3, 'email', 'tmp-staff@kitebud-test.invalid', 'role', 'authenticated', 'app_metadata', json_build_object('kitebud_role', 'payment_staff'))::text;
  perform set_config('role', 'anon', true); perform set_config('request.jwt.claims', anon_claims, true);
  select request_id into r7 from public.create_payment_request('KT-HJKM-2345');
  perform set_config('role', 'authenticated', true); perform set_config('request.jwt.claims', staff3, true);
  perform public.approve_payment(r7, 'TEST-REF-888');
  perform set_config('role', orig, true);
  begin
    delete from auth.users where id = s3;
    get diagnostics n = row_count;
    ok := n = 1;
  exception when others then ok := false; end;   -- e.g. the approved_is_complete rule refusing verified_by = NULL
  select pr.status, pr.verified_by, pr.verified_by_email into v, vb, ve from public.payment_requests pr where pr.id = r7;
  ok := ok and v = 'approved' and vb is null and ve = 'tmp-staff@kitebud-test.invalid';
  res := res || case when ok then 'PASS' else 'FAIL' end || ' T29 deleting a staff account keeps its approvals valid (verified_by empty, email kept)' || E'\n';

  -- GRANTS (catches Supabase's default "grant to anon/authenticated" on new objects) ---------------
  ok :=     not has_function_privilege('anon', 'public.approve_payment(uuid, text)', 'execute')
        and not has_function_privilege('anon', 'public.reject_payment(uuid, text)', 'execute')
        and not has_function_privilege('anon', 'public.is_payment_staff()', 'execute');
  res := res || case when ok then 'PASS' else 'FAIL' end || ' T19 anon cannot execute approve / reject / is_payment_staff' || E'\n';

  ok := not has_table_privilege('anon', 'public.payment_requests', 'select,insert,update,delete,truncate')
        and not has_any_column_privilege('anon', 'public.payment_requests', 'select,insert,update');
  res := res || case when ok then 'PASS' else 'FAIL' end || ' T20 anon has no rights on the table' || E'\n';

  ok := has_column_privilege('authenticated', 'public.payment_requests', 'status', 'select')
        and not has_table_privilege('authenticated', 'public.payment_requests', 'insert,update,delete,truncate')
        and not has_any_column_privilege('authenticated', 'public.payment_requests', 'insert,update');
  res := res || case when ok then 'PASS' else 'FAIL' end || ' T21 authenticated may only read the table (rows filtered to staff)' || E'\n';

  -- RESULT: a deliberate error, so nothing above can be kept ----------------------------------------
  select count(*) into passes from regexp_matches(res, '^PASS', 'gn');
  select count(*) into fails  from regexp_matches(res, '^FAIL', 'gn');
  raise exception E'KITEBud payment tests finished: % PASS, % FAIL (expected 30 PASS, 0 FAIL).\nThis error is deliberate: it throws away every test row.\n%', passes, fails, res;
end $$;
