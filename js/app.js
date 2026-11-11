/* KITE — core: storage & consent, language, header/footer/cookie banner, unlocks, demo.
   Scoring is in js/scoring.js. */
(function(){
const D = window.KITE_DATA;
const K = window.KITE = window.KITE || {};
const CKEY="kite_consent", SKEY="kite_state", VKEY="kite_view";
let mem = null;
const safe = (fn, fb) => { try { return fn(); } catch(e) { return fb; } };
/* i-Stand mode (the shared tablet at the showcase stand): switched on by opening any page with ?istand=1 once,
   off with ?istand=0. Kept in localStorage "kite_istand", which K.wipe() does NOT remove. Details: see the end of this file. */
const IKEY="kite_istand";
(function(){
  const q = safe(()=>new URLSearchParams(location.search).get("istand"), null);
  if(q==="1") safe(()=>localStorage.setItem(IKEY,"1")); else if(q==="0") safe(()=>localStorage.removeItem(IKEY));
  if(q!==null) safe(()=>{ const u = new URL(location.href); u.searchParams.delete("istand"); history.replaceState(history.state, "", u.pathname + u.search + u.hash); });
})();
K.ISTAND = safe(()=>localStorage.getItem(IKEY)==="1", false);
// page changes made by the code: in i-Stand mode they replace the history entry, so Back cannot return to a student's pages
K.go = url => { if(K.ISTAND) location.replace(url); else location.href = url; };
let frozen = false; // set by Finish: nothing may be saved again before the page changes

/* ---------- consent & storage ---------- */
K.consent = () => safe(() => localStorage.getItem(CKEY), null);
const store = () => K.consent()==="allow" ? localStorage : sessionStorage;
function genId(){
  const a="ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let s="";
  for(let i=0;i<8;i++){ s+=a[Math.floor(Math.random()*a.length)]; if(i===3) s+="-"; }
  return "KT-"+s;
}
// v2 = answers to the owner's validated questions (js/questions.js), scored with formula 1.0
// a: Part A · b1/b2/b3: interests · c: personality · d1: grades + track · d2: self-ratings
function fresh(){ return {v:2,id:genId(),lang:"km",a:{},b1:{},b1order:null,b2:{},b3:[],c:{known:null,type:"",alsoQuiz:false,quiz:{}},d1:{grades:{},track:null},d2:{},
  pos:0,done:false,paid:null,unlocked:[],pkg:"B",checks:{},started:null}; }
/* kite_vid cookie: the visitor ID only, created after Allow, for 180 days (owner's decision 2026-10-31).
   Deleted on Decline and by "Delete my data on this device". No other cookie is ever set. */
const VID="kite_vid", VID_DAYS=180;
const vidCookie = () => safe(()=>(document.cookie.match(/(?:^|;\s*)kite_vid=(KT-[A-Z0-9]{4}-[A-Z0-9]{4})/)||[])[1], null) || null;
function setVid(id){
  if(vidCookie()===id) return; // keep the first expiry date: 180 days from when it was created
  safe(()=>{ document.cookie = `${VID}=${id}; Max-Age=${VID_DAYS*86400}; Path=/; SameSite=Lax${location.protocol==="https:"?"; Secure":""}`; });
}
const dropVid = () => safe(()=>{ document.cookie = `${VID}=; Max-Age=0; Path=/; SameSite=Lax`; });
K.load = function(){
  let s = safe(()=>JSON.parse(store().getItem(SKEY)||"null"), null)
       || safe(()=>JSON.parse(sessionStorage.getItem(SKEY)||"null"), null)
       || mem;
  // answers saved by the old test (v1) can't be scored by formula 1.0: start again, keeping the visitor ID and language
  if(s && s.v!==2){ const old = s; s = fresh(); s.id = old.id || s.id; s.lang = old.lang || s.lang; K.save(s); }
  // browser storage was cleared but the cookie is still there: keep the same visitor ID
  if(!s){ s = fresh(); if(K.consent()==="allow" && vidCookie()) s.id = vidCookie(); K.save(s); }
  return s;
};
K.save = function(s){
  if(frozen) return;
  mem = s;
  safe(()=>store().setItem(SKEY, JSON.stringify(s)));
};
K.update = function(fn){ const s=K.load(); fn(s); K.save(s); return s; };
K.setConsent = function(c){
  const s = K.load();
  safe(()=>localStorage.setItem(CKEY, c));
  if(c==="allow"){ safe(()=>localStorage.setItem(SKEY, JSON.stringify(s))); safe(()=>sessionStorage.removeItem(SKEY)); setVid(s.id); }
  else { safe(()=>sessionStorage.setItem(SKEY, JSON.stringify(s))); safe(()=>localStorage.removeItem(SKEY)); dropVid(); }
  document.dispatchEvent(new CustomEvent("kite:consent"));
};
// (kite_istand is kept on purpose: the device stays in i-Stand mode for the next student)
K.wipe = function(){
  safe(()=>localStorage.removeItem(SKEY)); safe(()=>sessionStorage.removeItem(SKEY));
  safe(()=>localStorage.removeItem(CKEY)); safe(()=>sessionStorage.removeItem(VKEY));
  dropVid();
  mem = null;
};
K.isDemo = () => safe(()=>sessionStorage.getItem(VKEY)==="demo", false);
K.setDemo = on => safe(()=> on ? sessionStorage.setItem(VKEY,"demo") : sessionStorage.removeItem(VKEY));

/* ---------- language ---------- */
K.lang = () => (mem && mem.lang) || K.load().lang || "km";
K.t = (o, b) => { if(typeof o==="string") return K.lang()==="en" ? b : o; return o ? (o[K.lang()] ?? o.km) : ""; };
const KMD="០១២៣៤៥៦៧៨៩";
K.n = x => K.lang()==="km" ? String(x).replace(/[0-9]/g, d=>KMD[d]) : String(x);
K.esc = s => String(s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function applyStatic(root){
  const en = K.lang()==="en";
  (root||document).querySelectorAll("[data-en]").forEach(el=>{
    if(el.dataset.km===undefined) el.dataset.km = el.innerHTML;
    // payment on (js/config.js) uses data-pay-km / data-pay-en; showcase mode uses data-showcase-km / data-showcase-en
    const pay = K.PAYMENT && el.dataset.payEn!==undefined;
    const sc = !pay && K.SHOWCASE && el.dataset.showcaseEn!==undefined;
    el.innerHTML = pay ? (en ? el.dataset.payEn : el.dataset.payKm) : sc ? (en ? el.dataset.showcaseEn : el.dataset.showcaseKm) : (en ? el.dataset.en : el.dataset.km);
  });
  // payment on: [data-pay-hide] disappears, [data-pay-only] (hidden in the HTML) appears. Payment off: nothing is touched.
  if(K.PAYMENT){
    (root||document).querySelectorAll("[data-pay-hide]").forEach(el=>{ el.hidden = true; });
    (root||document).querySelectorAll("[data-pay-only]").forEach(el=>{ el.hidden = false; });
  }
  (root||document).querySelectorAll("[data-en-ph]").forEach(el=>{
    if(el.dataset.kmPh===undefined) el.dataset.kmPh = el.getAttribute("placeholder")||"";
    el.setAttribute("placeholder", en ? el.dataset.enPh : el.dataset.kmPh);
  });
  (root||document).querySelectorAll("[data-en-aria]").forEach(el=>{
    if(el.dataset.kmAria===undefined) el.dataset.kmAria = el.getAttribute("aria-label")||"";
    el.setAttribute("aria-label", en ? el.dataset.enAria : el.dataset.kmAria);
  });
  (root||document).querySelectorAll("[data-weight]").forEach(el=>{ el.textContent = K.weightPct(el.dataset.weight); });
  (root||document).querySelectorAll("[data-price]").forEach(el=>{ el.textContent = K.price(el.dataset.price); });
  document.documentElement.lang = en ? "en" : "km";
}
K.weightPct = part => K.n(Math.round(K.WEIGHTS[part]*100)) + "%";
// "Job 30% · Interest 30% · …", biggest weight first
K.weightsLine = () => Object.keys(K.WEIGHTS).sort((a,b)=>K.WEIGHTS[b]-K.WEIGHTS[a]).map(k=>K.t(K.PARTLABEL[k]) + " " + K.weightPct(k)).join(" · ");
K.applyStatic = applyStatic;
K.setLang = function(l){
  K.update(s=>{ s.lang=l; });
  applyStatic(); renderChrome();
  document.dispatchEvent(new CustomEvent("kite:lang"));
};

/* ---------- small helpers ---------- */
K.toast = function(msg){
  const el = document.createElement("div"); el.className="toast"; el.setAttribute("role","status"); el.textContent=msg;
  document.body.appendChild(el); setTimeout(()=>el.remove(), 2600);
};
K.copy = function(text, fallbackEl){
  const ok = () => K.toast(K.t("បានចម្លងរួចរាល់","Copied"));
  const fb = () => {
    if(fallbackEl){ fallbackEl.hidden=false; fallbackEl.value=text; fallbackEl.focus(); fallbackEl.select(); }
    K.toast(K.t("សូមចម្លងអត្ថបទដែលបានជ្រើស","Select and copy the highlighted text"));
  };
  try { navigator.clipboard.writeText(text).then(ok, fb); } catch(e){ fb(); }
};
K.flap = (pct, size) => pct===null || pct===undefined ? `<span class="small muted">${K.t(K.NOINFO)}</span>`
  : `<span class="flap ${size||"flap--md"} anim" aria-label="${K.n(pct)}%">${K.n(pct).split("").concat("%").map(c=>`<span>${c}</span>`).join("")}</span>`;
// the 4 part bars of a major; a missing part (null) shows "Not enough info" instead of a misleading 0
K.partBars = (parts, cls) => `<div class="bars ${cls||""}">${["job","interest","pers","strength"].map(k=>{ const v = parts[k], none = v===null || v===undefined;
  return `<div class="bar"><span>${K.t(K.PARTLABEL[k])}</span><div class="bar__track"><div class="bar__fill" style="width:${none?0:v}%"></div></div><span class="bar__val${none?" small muted":""}">${none ? K.t(K.NOINFO) : K.n(v)+"%"}</span></div>`; }).join("")}</div>`;
K.EMAIL = "weare@thekitebud.com";
// Prices in USD, shown everywhere from here. TEST MODE: later the server decides prices and checks payments.
K.PRICES = {A:"1.00", B:"2.50"};
K.price = pkg => "$" + K.PRICES[pkg];

/* ---------- header, footer, cookie banner ---------- */
const NAV = [
  {href:"index.html",km:"ទំព័រដើម",en:"Home",page:"home"},
  {href:"index.html#how",km:"របៀបដំណើរការ",en:"How it works"},
  {href:"index.html#pricing",km:"តម្លៃ",en:"Pricing"}
];
function renderChrome(){
  const page = document.body.dataset.page;
  const h = document.getElementById("kite-header");
  const lang = K.lang();
  const links = NAV.map(n=>`<a href="${n.href}"${n.page===page?' aria-current="page"':""}>${K.t(n)}</a>`).join("");
  if(h){
    h.innerHTML = `<div class="topbar"><div class="wrap topbar__in">
      <a class="logo" href="index.html" aria-label="KITEBud — ${K.t("ទំព័រដើម","Home")}"><span class="logo__mark" aria-hidden="true">✈</span>KITEBud</a>
      <nav class="nav" aria-label="${K.t("ម៉ឺនុយមេ","Main menu")}">${links}<a class="btn btn--gold" href="assessment.html">${K.t("ចាប់ផ្ដើមតេស្ត","Start test")}</a></nav>
      <button class="langbtn" type="button" id="langbtn" aria-label="${K.t("ប្ដូរភាសា","Change language")}"><span class="${lang==="km"?"on":""}">ខ្មែរ</span><span class="${lang==="en"?"on":""}">EN</span></button>
      ${K.ISTAND?`<button class="btn btn--sm istand-finish" type="button" id="istandFinish">Finish / ចប់</button>`:""}
      <button class="menubtn" type="button" id="menubtn" aria-expanded="false" aria-controls="mobilenav">${K.t("ម៉ឺនុយ","Menu")} ☰</button>
    </div>
    <div class="mobilenav" id="mobilenav" hidden><div class="wrap">${links}<a class="btn btn--gold" href="assessment.html">${K.t("ចាប់ផ្ដើមតេស្ត","Start test")}</a></div></div></div>`;
    h.querySelector("#langbtn").onclick = () => K.setLang(lang==="km"?"en":"km");
    const fin = h.querySelector("#istandFinish"); if(fin) fin.onclick = askFinish;
    const mb = h.querySelector("#menubtn"), mn = h.querySelector("#mobilenav");
    mb.onclick = () => { const o = mn.hidden; mn.hidden = !o; mb.setAttribute("aria-expanded", String(o)); };
  }
  const f = document.getElementById("kite-footer");
  if(f){
    f.innerHTML = `<div class="footer"><div class="wrap">
      <div class="footer__grid">
        <div class="stack" style="gap:10px">
          <a class="logo" href="index.html"><span class="logo__mark" aria-hidden="true">✈</span>KITEBud</a>
          <p>${K.t("ហោះហើរឆ្ពោះទៅរកជំនាញដែលសាកសមនឹងអ្នក។","Take off toward a major that fits you.")}</p>
        </div>
        <div class="footer__links">
          <span class="label" style="color:var(--board-label)">${K.t("ព័ត៌មាន","Info")}</span>
          <a href="about.html">${K.t("អំពីយើង និងប្រភព","About & sources")}</a>
          <a href="privacy.html">${K.t("ឯកជនភាព","Privacy")}</a>
          <a href="faq.html">${K.t("សំណួរញឹកញាប់ និងទំនាក់ទំនង","FAQ & contact")}</a>
          <button class="linkbtn" type="button" id="cookieset">${K.t("ការកំណត់ខូគី","Cookie settings")}</button>
        </div>
        <div class="footer__links">
          <span class="label" style="color:var(--board-label)">${K.t("ទំនាក់ទំនង","Contact")}</span>
          <span class="mono" style="user-select:all;color:var(--board-strong)">${K.EMAIL}</span>
          <button class="linkbtn" type="button" id="copyemail">${K.t("ចម្លងអ៊ីមែល","Copy email")}</button>
        </div>
      </div>
      <p class="footer__disc">${K.t("លទ្ធផលនេះសម្រាប់ការស្វែងយល់អំពីអាជីព មិនមែនជាការធានាការចូលរៀន ឬការងារឡើយ។","Results are for career exploration, not a guarantee of admission or a job.")}</p>
    </div></div>`;
    f.querySelector("#cookieset").onclick = () => showCookie(true);
    f.querySelector("#copyemail").onclick = () => K.copy(K.EMAIL);
  }
  const open = document.getElementById("kite-cookie");
  if(open && !open.hidden) showCookie(true);
}
function showCookie(force){
  let el = document.getElementById("kite-cookie");
  if(!el){ el = document.createElement("div"); el.id="kite-cookie"; el.className="cookie"; document.body.appendChild(el); }
  const c = K.consent();
  if(c && !force){ el.hidden = true; return; }
  el.hidden = false;
  const now = c ? `<p class="small muted">${K.t("ជម្រើសបច្ចុប្បន្ន: ","Current choice: ")}<b>${c==="allow"?K.t("អនុញ្ញាត","Allowed"):K.t("បដិសេធ","Declined")}</b></p>` : "";
  el.innerHTML = `<div class="cookie__card" role="dialog" aria-labelledby="ck-h" aria-describedby="ck-p">
    <h3 id="ck-h">${K.t("យើងគោរពឯកជនភាពរបស់អ្នក។","We respect your privacy.")}</h3>
    <p id="ck-p" class="small">${(K.PAYMENT ? K.t("បើអ្នកជ្រើស «អនុញ្ញាត» KITEBud នឹងបង្កើតខូគីអនាមិកមួយ ដែលមានលេខសម្គាល់អ្នកទស្សនារបស់អ្នក ហើយរក្សាទុកចម្លើយ និងលទ្ធផលតេស្តរបស់អ្នក សម្រាប់ការសិក្សារបស់យើង។ អ្នកអាចបដិសេធ ហើយនៅតែប្រើតេស្តបាន៖ គ្មានលេខសម្គាល់អ្នកទស្សនា ឬទិន្នន័យកម្រងសំណួរណាមួយ ត្រូវបានរក្សាទុកក្នុងមូលដ្ឋានទិន្នន័យរបស់យើងទេ លើកលែងតែកំណត់ត្រាការបង់ប្រាក់ ប្រសិនបើអ្នកបង់ប្រាក់។","If you choose Allow, KITEBud creates an anonymous cookie with your visitor ID and saves your test answers and results for our study. You can decline and still use the test: no visitor ID or questionnaire data will be saved to our database, except a payment record if you pay.") : K.t("បើអ្នកជ្រើស «អនុញ្ញាត» KITEBud នឹងបង្កើតខូគីអនាមិកមួយ ដែលមានលេខសម្គាល់អ្នកទស្សនារបស់អ្នក ហើយរក្សាទុកចម្លើយ និងលទ្ធផលតេស្តរបស់អ្នក សម្រាប់ការសិក្សារបស់យើង។ អ្នកអាចបដិសេធ ហើយនៅតែប្រើតេស្តបាន៖ គ្មានលេខសម្គាល់អ្នកទស្សនា ឬទិន្នន័យកម្រងសំណួរណាមួយ ត្រូវបានរក្សាទុកក្នុងមូលដ្ឋានទិន្នន័យរបស់យើងទេ។","If you choose Allow, KITEBud creates an anonymous cookie with your visitor ID and saves your test answers and results for our study. You can decline and still use the test: no visitor ID or questionnaire data will be saved to our database."))} <a href="privacy.html">${K.t("អានសេចក្តីជូនដំណឹងអំពីឯកជនភាព","Read the privacy notice")}</a></p>
    ${now}
    <div class="cookie__btns"><button class="btn btn--ink" type="button" data-c="allow">${K.t("អនុញ្ញាត","Allow")}</button><button class="btn btn--ink" type="button" data-c="decline">${K.t("បដិសេធ","Decline")}</button></div>
  </div>`;
  el.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{ K.setConsent(b.dataset.c); el.hidden=true; K.toast(b.dataset.c==="allow"?K.t("ចម្លើយរបស់អ្នកនឹងត្រូវរក្សាទុកសម្រាប់ការសិក្សា","Your answers will be saved for the study"):K.t("ចម្លើយនឹងបាត់ពេលបិទផ្ទាំងនេះ","Answers will clear when you close this tab")); });
}
K.showCookie = showCookie;

/* ---------- words for the plain-language profile ---------- */
K.PARTLABEL = {job:{km:"ការងារ",en:"Job"},interest:{km:"ចំណាប់អារម្មណ៍",en:"Interest"},pers:{km:"បុគ្គលិកលក្ខណៈ",en:"Personality"},strength:{km:"ចំណុចខ្លាំង",en:"Strength"}};
K.NOINFO = {km:"ព័ត៌មានមិនគ្រប់",en:"Not enough info"}; // the owner's wording for a missing score

// top interest types as names (never letters), e.g. "Thinker · Organizer · Doer" (K.INTEREST_NAMES in js/scoring.js)
K.interestWords = P => P.code.map(t=>K.t(K.INTEREST_NAMES[t]));
// personality as words, one per dimension: the side the student leans to (50 or more = first side)
K.persWords = P => P.dims ? D.Q.C.dimensions.map(d=>K.t(P.dims[d.id]>=50 ? d.high : d.low)) : null;
// the student's Part A answer, in words
K.jobChoice = s => {
  const a = s.a||{};
  if(a.mode==="job" && a.job){ const j = D.Q.A.jobs.find(x=>x.id===a.job); return j ? K.t(j) : null; }
  if(a.mode==="job" && a.custom) return a.custom;
  if(a.mode==="field" && a.field && a.field!=="none"){ const f = D.Q.A.fields.find(x=>x.id===a.field); return f ? K.t(f) : null; }
  return null;
};

/* ---------- unlocks & demo ---------- */
// showcase mode (js/config.js): every full report is free, no payment
K.SHOWCASE = !!(window.KITE_CONFIG && window.KITE_CONFIG.SHOWCASE_FREE);
K.SHOWCASE_LABEL = {km:"កំណែបង្ហាញ៖ របាយការណ៍ពេញលេញឥតគិតថ្លៃ", en:"Showcase: full report free"};
// payment (js/config.js PAYMENT_ENABLED, js/pay.js): only a paid session unlocks, and showcase mode is ignored.
// A page without js/pay.js has no K.hasPaidAccess, so with payment on it stays locked.
K.PAYMENT = !!(window.KITE_CONFIG && window.KITE_CONFIG.PAYMENT_ENABLED);
// unlocks are saved as major ids at payment time, so changing answers can't reveal other majors
K.unlocked = (s, majorId) => K.isDemo() || (K.PAYMENT ? !!(K.hasPaidAccess && K.hasPaidAccess(s))
  : (K.SHOWCASE || (s.unlocked||[]).includes(majorId)));
K.unlock = (s, majorIds) => { s.unlocked = [...new Set([...(s.unlocked||[]), ...majorIds])]; };
K.demoState = function(){
  // "Dara", a fictional student: all answers below are made up for the free sample
  const s = fresh(); s.id="KT-DEMO-0000"; s.lang = K.lang(); s.done=true; s.paid="B";
  s.a = {mode:"job", job:(D.Q.A.jobs.find(j=>j.en==="Data analyst")||{}).id};
  const like = {R:3,I:5,A:3,S:2,E:2,C:4};
  D.Q.B1.items.forEach((x,i)=>s.b1[x.id] = Math.max(1, like[x.type] - (i%4===0 ? 1 : 0)));
  s.b2 = {"b2-saturday":"I", "b2-class-party":"Data"};
  s.b3 = ["b3-02"];
  s.c = {known:"no", type:"", alsoQuiz:false, quiz:Object.fromEntries(D.Q.C.quiz.map((x,i)=>[x.id, [2,1,3, 3,0,3, 1,3,0, 0,2,1][i]]))};
  s.d1 = {grades:{math:"A",physics:"B",chemistry:"B",biology:"C",khmer:"B",english:"B",ict:"A"}, track:"science"};
  s.d2 = {math:4,logic:5,khmer:3,english:3,design:2,hands_on:3,people:2,organization:4,computer:5};
  return s;
};
K.state = () => K.isDemo() ? K.demoState() : K.load();

/* ---------- i-Stand mode ----------
   - "Finish / ចប់" in the header asks on the page (no browser dialog), then clears everything for the next student;
   - no touch or key press for ISTAND_IDLE_SECONDS: "Are you still there?" with an ISTAND_COUNTDOWN_SECONDS countdown;
     at zero it does the same as Finish;
   - every in-site link and every page change made by the code replaces the history entry (K.go), and a page
     that is loaded, or shown again from the back/forward cache, is checked: if the device was cleared since,
     or (payment on) the student has no access to this page, it is replaced by pay.html.
   staff.html does not load this file, so it never shows the Finish button. */
const IST = {
  askH:{km:"បញ្ចប់ ហើយសម្អាតឧបករណ៍នេះសម្រាប់សិស្សបន្ទាប់?", en:"Finish and clear this device for the next student?"},
  askP:{km:"ចម្លើយ លទ្ធផល និងការបង់ប្រាក់របស់អ្នកនៅលើឧបករណ៍នេះនឹងត្រូវលុប។", en:"Your answers, results and payment on this device will be deleted."},
  yes:{km:"បាទ/ចាស បញ្ចប់", en:"Yes, finish"}, no:{km:"បោះបង់", en:"Cancel"},
  idleH:{km:"តើអ្នកនៅទីនេះទេ?", en:"Are you still there?"},
  idleP:n=>({km:`អេក្រង់នេះនឹងត្រូវសម្អាតសម្រាប់សិស្សបន្ទាប់ ក្នុងរយៈពេល ${K.n(n)} វិនាទីទៀត។`, en:`This screen will be cleared for the next student in ${n} seconds.`}),
  cont:{km:"បន្ត", en:"Continue"}
};
const IC = window.KITE_CONFIG || {};
const IDLE_MS = (+IC.ISTAND_IDLE_SECONDS || 240) * 1000, COUNTDOWN = +IC.ISTAND_COUNTDOWN_SECONDS || 30;
// pay.html sets K.istandWaiting while a request waits for staff, so a student waiting at the stand gets longer
const WAITING_IDLE_MS = (+IC.ISTAND_WAITING_IDLE_SECONDS || 600) * 1000;
K.istandWaiting = false;
let ov = null, idleT = null, cdT = null, idleOpen = false, shownId = null;
function closeOverlay(){ if(ov){ ov.remove(); ov = null; } clearInterval(cdT); cdT = null; idleOpen = false; }
function overlay(html){
  closeOverlay();
  ov = document.createElement("div"); ov.className = "istand-ov"; ov.setAttribute("role","dialog"); ov.setAttribute("aria-modal","true"); ov.setAttribute("aria-labelledby","ist-h");
  ov.innerHTML = `<div class="istand-ov__card">${html}</div>`;
  document.body.appendChild(ov);
  return ov;
}
// clears this device for the next student: answers, results, payment, consent, the visitor ID cookie, the sample flag
K.istandFinish = function(){
  closeOverlay(); clearTimeout(idleT);
  safe(()=>sessionStorage.clear());
  K.wipe(); frozen = true;
  location.replace("pay.html");
};
function askFinish(){
  const id = K.load().id;
  overlay(`<h2 id="ist-h">${K.t(IST.askH)}</h2><p>${K.t(IST.askP)}</p>
    <p class="small">${K.t("លេខសម្គាល់អ្នកទស្សនារបស់អ្នក៖","Your visitor ID:")} <b class="mono">${K.esc(id)}</b></p>
    <div class="row"><button class="btn btn--ink" type="button" data-ist="yes">${K.t(IST.yes)}</button><button class="btn" type="button" data-ist="no">${K.t(IST.no)}</button></div>`);
  ov.querySelector('[data-ist="yes"]').onclick = K.istandFinish;
  const no = ov.querySelector('[data-ist="no"]'); no.onclick = () => { closeOverlay(); arm(); }; no.focus();
}
function arm(){ clearTimeout(idleT); if(K.ISTAND && !idleOpen) idleT = setTimeout(showIdle, K.istandWaiting ? WAITING_IDLE_MS : IDLE_MS); }
// pay.html: switch between the waiting time and the normal time (restarts the idle period)
K.istandSetWaiting = on => { on = !!on; if(K.istandWaiting === on) return; K.istandWaiting = on; if(K.ISTAND && !idleOpen) arm(); };
function showIdle(){
  let left = COUNTDOWN;
  overlay(`<h2 id="ist-h">${K.t(IST.idleH)}</h2><div class="istand-ov__count" id="ist-num" aria-hidden="true">${K.n(left)}</div>
    <p id="ist-left" aria-live="polite">${K.t(IST.idleP(left))}</p>
    <button class="btn btn--gold btn--lg" type="button" data-ist="cont">${K.t(IST.cont)}</button>`);
  ov.classList.add("istand-ov--idle"); idleOpen = true;
  const cont = ov.querySelector('[data-ist="cont"]'); cont.onclick = () => { closeOverlay(); arm(); }; cont.focus();
  cdT = setInterval(() => {
    left--;
    if(left <= 0){ K.istandFinish(); return; }
    const n = document.getElementById("ist-num"), p = document.getElementById("ist-left");
    if(n) n.textContent = K.n(left); if(p) p.textContent = K.t(IST.idleP(left));
  }, 1000);
}
// pages with a student's own content. Payment on: no access -> pay.html (the sample stays open on results/report).
// By FILE name: pay.html borrows data-page="checkout" for its look and must never be redirected to itself.
const PROTECTED = {assessment:1, results:1, report:1, checkout:1};
function istandOk(){
  const s = K.load(), page = (location.pathname.split("/").pop() || "index.html").replace(/\.html$/, "");
  if(shownId && s.id !== shownId) return false;                 // the device was cleared since this page was drawn
  if(!K.PAYMENT || !PROTECTED[page]) return true;
  if(page === "assessment") return !!(K.hasLiveSession && K.hasLiveSession(s));
  return K.isDemo() || !!(K.hasPaidAccess && K.hasPaidAccess(s));
}
function istandCheck(){ if(istandOk()) return true; location.replace("pay.html"); return false; }
function istandStart(){
  shownId = K.load().id;
  if(!istandCheck()) return;
  ["pointerdown","touchstart","keydown","wheel"].forEach(t => document.addEventListener(t, () => { if(!idleOpen) arm(); }, {capture:true, passive:true}));
  // in-site links replace the history entry (after the page's own click handlers have run)
  document.addEventListener("click", e => {
    if(e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest("a[href]");
    if(!a || a.target || a.hasAttribute("download")) return;
    const u = safe(()=>new URL(a.getAttribute("href"), location.href), null);
    if(!u || u.origin !== location.origin) return;
    if(u.pathname === location.pathname && u.search === location.search && u.hash) return; // a jump inside this page
    e.preventDefault(); location.replace(u.href);
  });
  // leaving: hide the page, so a copy kept by the browser for Back never flashes the old content
  window.addEventListener("pagehide", e => { closeOverlay(); clearTimeout(idleT); if(e.persisted) document.documentElement.style.visibility = "hidden"; });
  window.addEventListener("pageshow", e => {
    if(!e.persisted) return;
    mem = null;                                                   // re-read the device, not this page's old copy
    if(istandCheck()){ document.documentElement.style.visibility = ""; arm(); }
  });
  arm();
}

/* ---------- boot ---------- */
function boot(){
  const s = K.load();
  if(K.consent()==="allow") setVid(s.id); // visitors who allowed before the cookie existed get it too
  applyStatic(); renderChrome(); showCookie(false);
  if(K.ISTAND) istandStart();
}
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
