-- =====================================================================================================
-- KITEBud showcase payment: CASH APPROVAL TESTS. TEST PROJECT ONLY. Changes nothing in the database.
--
-- Cash needs no database change: staff.html approves a cash payment with approve_payment and a reference
-- that is unique PER REQUEST: CASH-<visitor code>-<first 4 characters of the request id, upper case>
-- (for example CASH-KT-ABCD-2345-7F3A). The existing unique index payment_requests_txn_ref_unique
-- (case and spaces ignored) stops one cash reference being used for a second request.
-- This file proves that against the real functions.
--
-- Needs: 01 applied in the TEST project, and the same two staff test accounts as 02_tests.sql. Put their
-- emails on the two lines marked EDIT HERE. Change nothing else.
-- Like 02_tests.sql, the whole file is one DO block that ENDS WITH A DELIBERATE ERROR, which undoes every
-- test row and shows the results.
--
-- Expected result: a red error box that starts
--   "KITEBud cash tests finished: 8 PASS, 0 FAIL"
-- =====================================================================================================
do $$
declare
  e1 text := 'STAFF_A_EMAIL';  -- EDIT HERE
  e2 text := 'STAFF_B_EMAIL';  -- EDIT HERE
  anon_claims text := '{"role":"anon"}';
  staff1 text; staff2 text; s1 uuid; s2 uuid;
  r1 uuid; t1 text; r2 uuid; t2 text; r3 uuid; t3 text;
  c1 text; c2 text; c3 text; v text; st record; ok boolean; res text := ''; passes int; fails int;
begin
  if e1 in ('STAFF_A_EMAIL', '') or e2 in ('STAFF_B_EMAIL', '') then
    raise exception 'Replace STAFF_A_EMAIL and STAFF_B_EMAIL at the top of this file first';
  end if;
  select id into s1 from auth.users where email = e1 and raw_app_meta_data ->> 'kitebud_role' = 'payment_staff';
  select id into s2 from auth.users where email = e2 and raw_app_meta_data ->> 'kitebud_role' = 'payment_staff';
  if s1 is null or s2 is null then
    raise exception 'Staff test accounts not found, or missing kitebud_role = payment_staff: %, %', e1, e2;
  end if;
  staff1 := json_build_object('sub', s1, 'email', e1, 'role', 'authenticated', 'app_metadata', json_build_object('kitebud_role', 'payment_staff'))::text;
  staff2 := json_build_object('sub', s2, 'email', e2, 'role', 'authenticated', 'app_metadata', json_build_object('kitebud_role', 'payment_staff'))::text;

  -- one student (visitor code KT-CSHA-2345) makes TWO requests; another student (KT-CSHB-6789) makes one
  perform set_config('role', 'anon', true); perform set_config('request.jwt.claims', anon_claims, true);
  select request_id, session_token into r1, t1 from public.create_payment_request('KT-CSHA-2345');
  select request_id, session_token into r2, t2 from public.create_payment_request('KT-CSHA-2345');
  select request_id, session_token into r3, t3 from public.create_payment_request('KT-CSHB-6789');
  -- the cash references, built exactly as staff.html builds them
  c1 := 'CASH-KT-CSHA-2345-' || upper(left(r1::text, 4));
  c2 := 'CASH-KT-CSHA-2345-' || upper(left(r2::text, 4));
  c3 := 'CASH-KT-CSHB-6789-' || upper(left(r3::text, 4));
  if c1 = c2 then   -- 1 chance in 65,536: the two random request ids start the same. Not a failure of the rule.
    raise exception 'The two test requests happen to share their first 4 characters. Run this file again.';
  end if;

  -- C1 staff A approves request 1 as cash
  perform set_config('role', 'authenticated', true); perform set_config('request.jwt.claims', staff1, true);
  select status into v from public.approve_payment(r1, c1);
  select pr.transaction_reference into t3 from public.payment_requests pr where pr.id = r1;
  ok := v = 'approved' and t3 = c1 and t3 ~ '^CASH-KT-CSHA-2345-[0-9A-F]{4}$';
  res := res || case when ok then 'PASS' else 'FAIL' end || ' C1 staff A approves request 1 as cash (' || c1 || ')' || E'\n';

  -- C2 the student sees the approval and gets access
  perform set_config('role', 'anon', true); perform set_config('request.jwt.claims', anon_claims, true);
  select * into st from public.get_payment_status(r1, t1);
  ok := st.status = 'approved' and st.access_granted;
  res := res || case when ok then 'PASS' else 'FAIL' end || ' C2 the student sees approved + access after a cash approval' || E'\n';

  -- C3 staff B approves the SAME visitor's second request as cash too: works (its own reference)
  perform set_config('role', 'authenticated', true); perform set_config('request.jwt.claims', staff2, true);
  select status into v from public.approve_payment(r2, c2);
  ok := v = 'approved';
  res := res || case when ok then 'PASS' else 'FAIL' end || ' C3 a second cash approval for the same visitor code, on a different request, works (' || c2 || ')' || E'\n';

  -- C4 the same request cannot be approved twice (same cash reference, or a different one)
  begin perform public.approve_payment(r1, c1); ok := false;
  exception when invalid_parameter_value then ok := sqlerrm = 'request already approved'; end;
  begin perform public.approve_payment(r1, 'CASH-KT-CSHA-2345-ZZZZ'); ok := false;
  exception when invalid_parameter_value then ok := ok and sqlerrm = 'request already approved'; end;
  res := res || case when ok then 'PASS' else 'FAIL' end || ' C4 the same request cannot be approved twice' || E'\n';

  -- C5 a CASH- reference cannot be reused for another request
  begin perform public.approve_payment(r3, c1); ok := false;
  exception when unique_violation then ok := sqlerrm = 'this ABA transaction reference was already used'; end;
  select pr.status into v from public.payment_requests pr where pr.id = r3;
  ok := ok and v = 'pending';
  res := res || case when ok then 'PASS' else 'FAIL' end || ' C5 a used CASH- reference cannot approve another request; that request stays pending' || E'\n';

  -- C6 lower case and spaces do not get round it
  begin perform public.approve_payment(r3, '  ' || lower(c2) || ' '); ok := false;
  exception when unique_violation then ok := true; end;
  select pr.status into v from public.payment_requests pr where pr.id = r3;
  ok := ok and v = 'pending';
  res := res || case when ok then 'PASS' else 'FAIL' end || ' C6 the same CASH- reference in lower case with spaces is refused too' || E'\n';

  -- C7 the other student's request is then approved with its own cash reference
  select status into v from public.approve_payment(r3, c3);
  ok := v = 'approved';
  res := res || case when ok then 'PASS' else 'FAIL' end || ' C7 another visitor''s request is approved with its own cash reference' || E'\n';

  -- C8 both of the first student's requests are approved, with two different references
  select count(*)::int, count(distinct transaction_reference)::int into passes, fails
    from public.payment_requests where visitor_code = 'KT-CSHA-2345' and status = 'approved';
  ok := passes = 2 and fails = 2;
  res := res || case when ok then 'PASS' else 'FAIL' end || ' C8 one visitor code now has two cash approvals with two different references' || E'\n';

  select count(*) into passes from regexp_matches(res, '^PASS', 'gn');
  select count(*) into fails  from regexp_matches(res, '^FAIL', 'gn');
  raise exception E'KITEBud cash tests finished: % PASS, % FAIL (expected 8 PASS, 0 FAIL).\nThis error is deliberate: it throws away every test row.\n%', passes, fails, res;
end $$;
