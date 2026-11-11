/* KITE — showcase payment: 3,000៛ by ABA KHQR, checked by hand by staff in staff.html.
   Loaded after js/app.js on the pages that need it. Does nothing when PAYMENT_ENABLED is false (js/config.js).
   - The payment works whether the student chose Allow or Decline: it has its own Supabase client with
     persistSession false, and it is NOT js/db.js (which saves answers only with Allow).
   - What it keeps is s.pay inside the student's normal saved state, so it follows the Allow/Decline storage
     rule and "Delete my data on this device" (K.wipe) removes it:
       s.pay = {requests: [{requestId, token, createdAt, status, pendingExpiresAt, sessionExpiresAt, approvedAt}]}
     at most the last 3 requests. token is a request's secret: only ever sent to get_payment_status, never shown.
   - The database decides everything (amount, 20-minute pending window, 2-hour session). This file only reads it.
   ACCEPTED LIMITATION: the gate runs in the browser. Someone who edits their own browser storage can get
   past it. It stops ordinary students, nothing more (see supabase/01_payment_requests.sql). */
(function(){
const K = window.KITE, C = window.KITE_CONFIG || {};
const LIB = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.118.0/dist/umd/supabase.js"; // same pinned file as js/db.js
const LIB_SRI = "sha384-TcHRA3zBbn+Lexh5n+Oil4guNPOS3rjNDpGRAN46u/s/mB2IZ50ceC6TYDU2yvgK";

K.PAY = {
  amount: C.PAYMENT_AMOUNT || 3000,
  usd: C.PAYMENT_DISPLAY_USD || "0.75",
  qr: C.KHQR_IMAGE || "images/aba-khqr-3000.png",
  pendingMinutes: C.PENDING_MINUTES || 20,
  sessionHours: C.SESSION_HOURS || 2
};
const ms = iso => iso ? Date.parse(iso) : NaN;
// shown on results/report when a test was finished after the paid 2 hours ended
K.PAY_LOCKED = {km:"ពេលវេលាដែលអ្នកបានបង់ប្រាក់បានបញ្ចប់ មុនពេលអ្នកធ្វើតេស្តចប់។ សូមនិយាយជាមួយបុគ្គលិក។", en:"Your paid time ended before you finished the test. Please talk to staff."};

/* ---------- the student's requests (no network) ----------
   A student may have up to 3 requests (an expired one can still be approved by staff, so a new one does not
   replace it). Every request that is not decided yet is followed, and ANY approved one gives access. */
const MAX_REQUESTS = 3;
const undecided = r => !r.status || r.status === "pending" || r.status === "expired";
const live = r => r.status === "approved" && ms(r.sessionExpiresAt) > Date.now();
K.payRequests = s => {
  const p = s && s.pay;
  if(!p) return [];
  if(Array.isArray(p.requests)) return p.requests;
  // the single-request shape used in the first Phase 4 test build
  if(p.requestId) return [{ requestId:p.requestId, token:p.token, createdAt:null, status:p.status,
    pendingExpiresAt:p.pendingExpiresAt, sessionExpiresAt:p.sessionExpiresAt, approvedAt:p.approvedAt }];
  return [];
};
// an approved payment whose 2-hour session has not ended: may start or continue the test
K.hasLiveSession = s => K.payRequests(s).some(live);
// may see the report: a live session, OR the test was finished while an approved session was still running
// (owner's decision: a report finished within the 2 hours stays viewable on this device)
K.hasPaidAccess = s => {
  const ok = K.payRequests(s).filter(r => r.status === "approved");
  if(ok.some(live)) return true;
  return !!(s && s.done && s.finishedAt && ok.some(r => s.finishedAt <= ms(r.sessionExpiresAt)));
};
// when the latest running session ends (for display only)
K.paySessionEnd = s => { const t = K.payRequests(s).filter(live).map(r => ms(r.sessionExpiresAt)); return t.length ? new Date(Math.max(...t)) : null; };
// the screen to show: "approved" | "pending" | "expired" | "rejected" | "ended" (paid time is over) | "none"
K.payState = s => {
  const rs = K.payRequests(s), now = Date.now();
  if(!rs.length) return "none";
  if(rs.some(live)) return "approved";
  if(rs.some(r => (!r.status || r.status === "pending") && !(ms(r.pendingExpiresAt) <= now))) return "pending";
  if(rs.some(undecided)) return "expired";
  return rs[rs.length - 1].status === "rejected" ? "rejected" : "ended";
};
K.payOpenCount = s => K.payRequests(s).filter(undecided).length;

/* ---------- database (only pay.html calls these) ---------- */
let client = null, libP = null;
function lib(){
  if(window.supabase) return Promise.resolve();
  if(libP) return libP;
  return libP = new Promise((ok, fail) => {
    const el = document.createElement("script");
    el.src = LIB; el.integrity = LIB_SRI; el.crossOrigin = "anonymous"; el.async = true;
    el.onload = ok; el.onerror = () => { libP = null; el.remove(); fail(new TypeError("Failed to fetch the Supabase library")); };
    document.head.appendChild(el);
  });
}
async function db(){
  if(!C.SUPABASE_URL || !C.SUPABASE_KEY) throw Object.assign(new Error("database not set"), {kind:"config"});
  await lib();
  return client || (client = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_KEY,
    {auth:{persistSession:false, autoRefreshToken:false, detectSessionInUrl:false}}));
}
const first = d => Array.isArray(d) ? d[0] : d;

// what went wrong, as one word the page turns into plain Khmer/English (never shown as database text)
K.payErrorKind = e => {
  if(e && e.kind) return e.kind;
  if(e && e.code === "54000") return "busy";
  const m = String((e && e.message) || e || "");
  if((typeof navigator !== "undefined" && navigator.onLine === false) || /fetch|network|load failed/i.test(m)) return "offline";
  return "other";
};

K.payApi = {
  // a new request for this student's visitor ID. Earlier undecided requests are kept and still followed.
  async create(){
    const s = K.load(), sb = await db();
    const { data, error } = await sb.rpc("create_payment_request", { p_visitor_code: s.id });
    if(error) throw error;
    const r = first(data);
    if(!r || !r.request_id || !r.session_token) throw new Error("no request returned");
    K.update(x => {
      const list = K.payRequests(x).slice();
      list.push({ requestId:r.request_id, token:r.session_token, createdAt:new Date().toISOString(), status:"pending",
        pendingExpiresAt:r.pending_expires_at, sessionExpiresAt:null, approvedAt:null });
      // keep the last 3: drop decided ones (rejected, or approved but over) before any open one
      while(list.length > MAX_REQUESTS){
        const i = list.findIndex(q => !undecided(q) && !live(q));
        list.splice(i >= 0 ? i : 0, 1);
      }
      x.pay = { requests: list };
    });
  },
  // asks the database about every undecided request; returns {state, missing} (state as in K.payState)
  async check(){
    const open = K.payRequests(K.load()).filter(undecided);
    if(!open.length) return { state: K.payState(K.load()), missing: 0 };
    const sb = await db();
    const got = await Promise.allSettled(open.map(async q => {
      const { data, error } = await sb.rpc("get_payment_status", { p_request_id: q.requestId, p_session_token: q.token });
      if(error) throw error;
      return { id: q.requestId, r: first(data) || null };
    }));
    let missing = 0;
    K.update(x => {
      let list = K.payRequests(x).slice();
      for(const g of got){
        if(g.status !== "fulfilled") continue;
        const { id, r } = g.value, i = list.findIndex(q => q.requestId === id);
        if(i < 0) continue;                                         // removed meanwhile
        if(!r){ list.splice(i, 1); missing++; continue; }           // unknown request or wrong secret: forget it
        const q = Object.assign({}, list[i]);
        if(r.status === "approved" && !q.approvedAt) q.approvedAt = new Date().toISOString(); // first seen on this device
        q.status = r.status; q.pendingExpiresAt = r.pending_expires_at; q.sessionExpiresAt = r.session_expires_at;
        list[i] = q;
      }
      x.pay = list.length ? { requests: list } : null;
    });
    const failed = got.find(g => g.status === "rejected");
    const state = K.payState(K.load());
    if(failed && state !== "approved") throw failed.reason;   // an approval wins over a failed check of another request
    return { state, missing };
  }
};

/* ---------- "Start test" links go to the payment screen while there is no paid session ---------- */
function relink(){
  if(!K.PAYMENT || K.isDemo() || K.hasLiveSession(K.load())) return;
  document.querySelectorAll('a[href="assessment.html"]').forEach(a => a.setAttribute("href", "pay.html"));
}
// after the page's own DOMContentLoaded / language / consent rendering, which may redraw those links
const later = () => setTimeout(relink, 0);
document.addEventListener("DOMContentLoaded", later);
document.addEventListener("kite:lang", later);
document.addEventListener("kite:consent", later);
})();
