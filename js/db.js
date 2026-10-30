/* KITE — saving to Supabase. INSERT ONLY: the website can never read the database (Row Level Security).
   - Nothing is sent unless the student chose Allow on the cookie banner, and never for the free sample (demo).
   - The Supabase library is loaded from the CDN only then, in the background, so pages never wait for it.
   - Never add .select() after an insert: the website may not read, so it would fail.
   - If saving fails (no internet, Supabase paused, wrong column), the test keeps working: console.log only,
     nothing is shown to the student, and the part is tried again on the next page.
   What was sent is remembered in the student's saved state (s.db), so nothing is sent twice. */
(function(){
const K = window.KITE, C = window.KITE_CONFIG || {};
const LIB = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.118.0/dist/umd/supabase.js"; // pinned v2
const LIB_SRI = "sha384-TcHRA3zBbn+Lexh5n+Oil4guNPOS3rjNDpGRAN46u/s/mB2IZ50ceC6TYDU2yvgK";        // the exact file

/* Table and column names: the ONLY place they are written. Change here if the database uses other names. */
const T = {
  visitors: "visitors", consents: "consents", responses: "responses", results: "results", feedback: "feedback"
};
const ROW = {
  visitor:  s => ({visitor_id: s.id, language: lang(s), device_type: deviceType()}),
  consent:  (s, choice) => ({visitor_id: s.id, choice}),                                   // "allow"
  response: (s, part, answers) => ({visitor_id: s.id, part, answers}),                     // part "A" | "B" | "C" | "D"
  result:   (s, R, seconds) => ({visitor_id: s.id, formula_version: K.FORMULA_VERSION, duration_seconds: seconds,
              scores: R.all.map(x=>({major: x.id, pct: x.pct, parts: x.parts}))}),         // all 16 majors, best first
  feedback: (s, rating, comment) => ({visitor_id: s.id, rating, comment: comment || null})
};
// the answers of each finished part (column "answers", jsonb)
const ANSWERS = {
  A: s => s.a,
  B: s => ({b1: s.b1, b1order: s.b1order, b2: s.b2, b3: s.b3}),
  C: s => s.c,
  D: s => ({grades: s.d1.grades, track: s.d1.track, d2: s.d2})
};

const log = (...a) => console.log("[KITE db]", ...a);
const lang = s => s.lang==="en" ? "en" : "km";                                   // exactly "km" or "en"
function deviceType(){                                                           // exactly "phone", "tablet" or "desktop"
  const ua = navigator.userAgent || "", small = Math.min(screen.width || 9999, screen.height || 9999);
  if(/iPad|Tablet/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua)) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return "tablet";
  if(/Mobi|iPhone|iPod|Android/i.test(ua) || small < 600) return "phone";
  return "desktop";
}
const allowed = () => !!(C.SUPABASE_URL && C.SUPABASE_KEY) && K.consent()==="allow" && !K.isDemo();
const mark = fn => K.update(s=>{ s.db = s.db || {}; fn(s.db); });

/* ---------- the client: loaded once, only when needed ---------- */
let clientP = null;
function client(){
  if(!clientP) clientP = new Promise(done=>{
    const make = () => { try { return window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_KEY, {auth:{persistSession:false, autoRefreshToken:false, detectSessionInUrl:false}}); } catch(e){ log("client error", e); return null; } };
    if(window.supabase) return done(make());
    const el = document.createElement("script");
    el.src = LIB; el.integrity = LIB_SRI; el.crossOrigin = "anonymous"; el.async = true;
    el.onload = () => done(window.supabase ? make() : null);
    el.onerror = () => { log("could not load the Supabase library (offline?)"); clientP = null; done(null); };
    document.head.appendChild(el);
  });
  return clientP;
}
// one insert; true when saved. visitors: "duplicate" (23505) means it is already there, which is fine.
async function insert(table, row){
  if(!allowed()) return false;
  const c = await client(); if(!c) return false;
  try {
    const {error} = await c.from(table).insert(row);            // no .select(): the website may not read
    if(!error) return true;
    if(table===T.visitors && error.code==="23505") return true;
    log(`${table}: not saved`, error.code || "", error.message || error);
  } catch(e){ log(`${table}: not saved`, e && e.message || e); }
  return false;
}

/* ---------- visitor (once per visitor ID) ---------- */
let visitorP = null, visitorFor = null;
function ensureVisitor(){
  const s = K.load();
  if(s.db && s.db.visitor===s.id) return Promise.resolve(true);
  if(visitorP && visitorFor===s.id) return visitorP;
  visitorFor = s.id;
  visitorP = insert(T.visitors, ROW.visitor(s)).then(ok=>{ if(ok) mark(d=>d.visitor = s.id); else visitorP = null; return ok; });
  return visitorP;
}
// the same save never runs twice at once (two scripts on one page may ask for it together)
const inflight = {};
const once = (key, fn) => inflight[key] || (inflight[key] = fn().finally(()=>{ delete inflight[key]; }));
// everything else needs the visitor row first
async function save(table, row){ return allowed() && await ensureVisitor() && await insert(table, row); }

/* ---------- consent: a row each time the choice changes to Allow ---------- */
// Only "allow" is ever sent: after Decline nothing leaves the device.
const syncConsent = () => once("consent", async ()=>{
  const s = K.load(), now = K.consent();
  if(!now || (s.db && s.db.consent===now)) return;
  if(now!=="allow"){ mark(d=>d.consent = now); return; }
  if(await save(T.consents, ROW.consent(s, "allow"))) mark(d=>d.consent = "allow");
});

/* ---------- answers: one row per finished part ---------- */
const savePart = part => once("part" + part, async ()=>{
  const s = K.load();
  if(!ANSWERS[part] || (s.db && s.db.parts && s.db.parts[part])) return;
  if(await save(T.responses, ROW.response(s, part, ANSWERS[part](s)))) mark(d=>{ d.parts = d.parts || {}; d.parts[part] = true; });
});
// parts finished but not saved yet (e.g. offline earlier): try again
async function saveFinishedParts(){
  const s = K.load(), done = s.done ? ["A","B","C","D"] : (s.finishedParts || []);
  for(const p of done) await savePart(p);
}

/* ---------- results (results page, once per finished test) ---------- */
const saveResults = R => once("results", async ()=>{
  const s = K.load();
  if(!s.done || (s.db && s.db.result)) return;
  await saveFinishedParts();
  const seconds = s.started ? Math.max(0, Math.round(((s.finishedAt || Date.now()) - s.started) / 1000)) : null;
  if(await save(T.results, ROW.result(s, R, seconds))) mark(d=>d.result = true);
});

/* ---------- feedback ---------- */
const sendFeedback = (rating, comment) => once("feedback", async ()=>{
  const s = K.load();
  if(!(rating>=1 && rating<=5)) return;
  if(await save(T.feedback, ROW.feedback(s, rating, String(comment||"").trim().slice(0,500)))) mark(d=>d.feedback = true);
});

K.db = {allowed, savePart, saveFinishedParts, saveResults, sendFeedback, deviceType};

// on every page: when the student allows (now or earlier), record the visitor and the choice; retry unsent parts
function boot(){ if(allowed()) syncConsent().then(saveFinishedParts); }
document.addEventListener("kite:consent", ()=>{ syncConsent().then(()=>{ if(allowed()) saveFinishedParts(); }); });
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
