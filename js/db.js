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
/* visitors.id is a UUID. It is made from the student's visible visitor ID (KT-…) with UUID v5 (RFC 4122),
   so a deletion request that gives the visible ID can always be matched. In the Supabase SQL Editor:
     select extensions.uuid_generate_v5('6b5a96b7-10d9-45d8-930d-7fdfd50759c9', 'KT-AB12-CD34');  */
const VID_NS = "6b5a96b7-10d9-45d8-930d-7fdfd50759c9";
const uuids = {};
async function uuidFor(code){
  if(uuids[code]) return uuids[code];
  const ns = Uint8Array.from(VID_NS.replace(/-/g,"").match(/../g), x=>parseInt(x,16));
  const n = new TextEncoder().encode(code), buf = new Uint8Array(16 + n.length);
  buf.set(ns); buf.set(n, 16);
  const h = new Uint8Array(await crypto.subtle.digest("SHA-1", buf)).slice(0, 16);
  h[6] = (h[6] & 0x0f) | 0x50; h[8] = (h[8] & 0x3f) | 0x80;
  const x = [...h].map(b=>b.toString(16).padStart(2,"0")).join("");
  return uuids[code] = `${x.slice(0,8)}-${x.slice(8,12)}-${x.slice(12,16)}-${x.slice(16,20)}-${x.slice(20)}`;
}
const uid = s => uuids[s.id]; // filled by uuidFor() before any row is built

const ROW = {
  visitor: s => ({
    id: uid(s),
    language: lang(s),
    device_type: deviceType()
  }),

  consent: (s, choice) => ({
    visitor_id: uid(s),
    choice,
    policy_version: "1.0"
  }),

  response: (s, part, answers) => ({
    visitor_id: uid(s),
    part,
    answers
  }),

  result: (s, R, seconds) => ({
    visitor_id: uid(s),
    results: R.all.map(x => ({
      major: x.id,
      pct: x.pct,
      parts: x.parts
    })),
    formula_version: K.FORMULA_VERSION,
    duration_seconds: seconds
  }),

  feedback: (s, rating, comment) => ({
    visitor_id: uid(s),
    fit_rating: rating,
    comment: comment || null
  })
};
// the answers of each finished part (column "answers", jsonb)

const ANSWERS = {
  A: s => s.a,
  B1: s => ({
    answers: s.b1,
    order: s.b1order
  }),
  B2: s => s.b2,
  B3: s => s.b3,
  C: s => s.c,
  D1: s => ({
    grades: s.d1.grades,
    track: s.d1.track
  }),
  D2: s => s.d2
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
  visitorP = uuidFor(s.id).then(()=>insert(T.visitors, ROW.visitor(s)), e=>{ log("no visitor UUID", e && e.message || e); return false; })
    .then(ok=>{ if(ok) mark(d=>d.visitor = s.id); else visitorP = null; return ok; });
  return visitorP;
}
// the same save never runs twice at once (two scripts on one page may ask for it together)
const inflight = {};
const once = (key, fn) => inflight[key] || (inflight[key] = fn().finally(()=>{ delete inflight[key]; }));
// everything else needs the visitor row first
// build = a function that makes the row (called after the UUID is ready)
async function save(table, build){
  if(!allowed()) return false;
  try { await uuidFor(K.load().id); } catch(e){ log("no visitor UUID", e && e.message || e); return false; }
  return await ensureVisitor() && await insert(table, build());
}

/* ---------- consent: a row each time the choice changes to Allow ---------- */
// Only "allow" is ever sent: after Decline nothing leaves the device.
const syncConsent = () => once("consent", async ()=>{
  const s = K.load(), now = K.consent();
  if(!now || (s.db && s.db.consent===now)) return;
  if(now!=="allow"){ mark(d=>d.consent = now); return; }
  if(await save(T.consents, ()=>ROW.consent(s, "allow"))) mark(d=>d.consent = "allow");
});

/* ---------- answers: one row per finished part ---------- */
const PARTS = {A:["A"], B:["B1","B2","B3"], C:["C"], D:["D1","D2"]}; // visible part → rows in the database
const saveRow = part => once("part" + part, async ()=>{
  const s = K.load();
  if(!ANSWERS[part] || (s.db && s.db.parts && s.db.parts[part])) return;
  if(await save(T.responses, ()=>ROW.response(s, part, ANSWERS[part](s)))) mark(d=>{ d.parts = d.parts || {}; d.parts[part] = true; });
});
async function savePart(part){ for(const p of (PARTS[part] || [])) await saveRow(p); }
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
  let seconds = s.started ? Math.round(((s.finishedAt || Date.now()) - s.started) / 1000) : null;
  if(!(seconds >= 0 && seconds <= 86400)) seconds = null; // the database accepts 0..86400 (1 day); longer is sent as empty
  if(await save(T.results, ()=>ROW.result(s, R, seconds))) mark(d=>d.result = true);
});

/* ---------- feedback ---------- */
const sendFeedback = (rating, comment) => once("feedback", async ()=>{
  const s = K.load();
  if(!(rating>=1 && rating<=5)) return;
  if(await save(T.feedback, ()=>ROW.feedback(s, rating, String(comment||"").trim().slice(0,500)))) mark(d=>d.feedback = true);
});

K.db = {allowed, savePart, saveFinishedParts, saveResults, sendFeedback, deviceType};

// on every page: when the student allows (now or earlier), record the visitor and the choice; retry unsent parts
function boot(){ if(allowed()) syncConsent().then(saveFinishedParts); }
document.addEventListener("kite:consent", ()=>{ syncConsent().then(()=>{ if(allowed()) saveFinishedParts(); }); });
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
