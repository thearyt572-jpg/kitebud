/* KITE — core: storage & consent, language, header/footer/cookie banner, unlocks, demo.
   Scoring is in js/scoring.js. */
(function(){
const D = window.KITE_DATA;
const K = window.KITE = window.KITE || {};
const CKEY="kite_consent", SKEY="kite_state", VKEY="kite_view";
let mem = null;
const safe = (fn, fb) => { try { return fn(); } catch(e) { return fb; } };

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
K.load = function(){
  let s = safe(()=>JSON.parse(store().getItem(SKEY)||"null"), null)
       || safe(()=>JSON.parse(sessionStorage.getItem(SKEY)||"null"), null)
       || mem;
  // answers saved by the old test (v1) can't be scored by formula 1.0: start again, keeping the visitor ID and language
  if(s && s.v!==2){ const old = s; s = fresh(); s.id = old.id || s.id; s.lang = old.lang || s.lang; K.save(s); }
  if(!s){ s = fresh(); K.save(s); }
  return s;
};
K.save = function(s){
  mem = s;
  safe(()=>store().setItem(SKEY, JSON.stringify(s)));
};
K.update = function(fn){ const s=K.load(); fn(s); K.save(s); return s; };
K.setConsent = function(c){
  const s = K.load();
  safe(()=>localStorage.setItem(CKEY, c));
  if(c==="allow"){ safe(()=>localStorage.setItem(SKEY, JSON.stringify(s))); safe(()=>sessionStorage.removeItem(SKEY)); }
  else { safe(()=>sessionStorage.setItem(SKEY, JSON.stringify(s))); safe(()=>localStorage.removeItem(SKEY)); }
  document.dispatchEvent(new CustomEvent("kite:consent"));
};
K.wipe = function(){
  safe(()=>localStorage.removeItem(SKEY)); safe(()=>sessionStorage.removeItem(SKEY));
  safe(()=>localStorage.removeItem(CKEY)); safe(()=>sessionStorage.removeItem(VKEY));
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
    el.innerHTML = en ? el.dataset.en : el.dataset.km;
  });
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
      <a class="logo" href="index.html" aria-label="KITE — ${K.t("ទំព័រដើម","Home")}"><span class="logo__mark" aria-hidden="true">✈</span>KITE</a>
      <nav class="nav" aria-label="${K.t("ម៉ឺនុយមេ","Main menu")}">${links}<a class="btn btn--gold" href="assessment.html">${K.t("ចាប់ផ្ដើមតេស្ត","Start test")}</a></nav>
      <button class="langbtn" type="button" id="langbtn" aria-label="${K.t("ប្ដូរភាសា","Change language")}"><span class="${lang==="km"?"on":""}">ខ្មែរ</span><span class="${lang==="en"?"on":""}">EN</span></button>
      <button class="menubtn" type="button" id="menubtn" aria-expanded="false" aria-controls="mobilenav">${K.t("ម៉ឺនុយ","Menu")} ☰</button>
    </div>
    <div class="mobilenav" id="mobilenav" hidden><div class="wrap">${links}<a class="btn btn--gold" href="assessment.html">${K.t("ចាប់ផ្ដើមតេស្ត","Start test")}</a></div></div></div>`;
    h.querySelector("#langbtn").onclick = () => K.setLang(lang==="km"?"en":"km");
    const mb = h.querySelector("#menubtn"), mn = h.querySelector("#mobilenav");
    mb.onclick = () => { const o = mn.hidden; mn.hidden = !o; mb.setAttribute("aria-expanded", String(o)); };
  }
  const f = document.getElementById("kite-footer");
  if(f){
    f.innerHTML = `<div class="footer"><div class="wrap">
      <div class="footer__grid">
        <div class="stack" style="gap:10px">
          <a class="logo" href="index.html"><span class="logo__mark" aria-hidden="true">✈</span>KITE</a>
          <p>${K.t("ហោះហើរឆ្ពោះទៅរកជំនាញដែលសាកសមនឹងអ្នក។","Take off toward a major that fits you.")}</p>
        </div>
        <div class="footer__links">
          <span class="label" style="color:#9FB3C4">${K.t("ព័ត៌មាន","Info")}</span>
          <a href="about.html">${K.t("អំពីយើង និងប្រភព","About & sources")}</a>
          <a href="privacy.html">${K.t("ឯកជនភាព","Privacy")}</a>
          <a href="faq.html">${K.t("សំណួរញឹកញាប់ និងទំនាក់ទំនង","FAQ & contact")}</a>
          <button class="linkbtn" type="button" id="cookieset">${K.t("ការកំណត់ខូគី","Cookie settings")}</button>
        </div>
        <div class="footer__links">
          <span class="label" style="color:#9FB3C4">${K.t("ទំនាក់ទំនង","Contact")}</span>
          <span class="mono" style="user-select:all;color:#fff">${K.EMAIL}</span>
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
    <h3 id="ck-h">${K.t("ខូគី និងការរក្សាទុកចម្លើយ","Cookies and saving your answers")}</h3>
    <p id="ck-p" class="small"><span class="ck-long">${K.t("KITE ប្រើការផ្ទុកក្នុងកម្មវិធីរុករក (ខូគី) តែដើម្បីរក្សាចម្លើយ និងលទ្ធផលរបស់អ្នកនៅលើឧបករណ៍នេះ ដើម្បីឱ្យអ្នកអាចបន្តពេលក្រោយ។ យើងមិនប្រើខូគីសម្រាប់ការផ្សាយពាណិជ្ជកម្មទេ។ បើអ្នកបដិសេធ តេស្តនៅតែដំណើរការ ប៉ុន្តែចម្លើយនឹងបាត់ពេលអ្នកបិទផ្ទាំងនេះ។","KITE uses browser storage (cookies) only to keep your answers and results on this device, so you can continue later. We never use cookies for ads. If you decline, the test still works, but your answers disappear when you close this tab.")} <a href="privacy.html#cookies">${K.t("អានគោលការណ៍ឯកជនភាព","Read the privacy policy")}</a></span><span class="ck-short">${K.t("យើងរក្សាទុកចម្លើយរបស់អ្នកតែលើឧបករណ៍នេះ ដើម្បីឱ្យអ្នកបន្តពេលក្រោយបាន។ បើបដិសេធ ចម្លើយនឹងបាត់ពេលអ្នកបិទផ្ទាំងនេះ។","We save your answers only on this device so you can continue later. If you decline, they clear when you close this tab.")} <a href="privacy.html#cookies">${K.t("អានបន្ថែម","Read more")}</a></span></p>
    ${now}
    <div class="cookie__btns"><button class="btn btn--ink" type="button" data-c="allow">${K.t("អនុញ្ញាត","Allow")}</button><button class="btn btn--ink" type="button" data-c="decline">${K.t("បដិសេធ","Decline")}</button></div>
  </div>`;
  el.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{ K.setConsent(b.dataset.c); el.hidden=true; K.toast(b.dataset.c==="allow"?K.t("ចម្លើយនឹងត្រូវរក្សាទុកនៅលើឧបករណ៍នេះ","Answers will be saved on this device"):K.t("ចម្លើយនឹងបាត់ពេលបិទផ្ទាំងនេះ","Answers will clear when you close this tab")); });
}
K.showCookie = showCookie;

/* ---------- words for the plain-language profile ---------- */
K.PARTLABEL = {job:{km:"ការងារ",en:"Job"},interest:{km:"ចំណាប់អារម្មណ៍",en:"Interest"},pers:{km:"បុគ្គលិកលក្ខណៈ",en:"Personality"},strength:{km:"ចំណុចខ្លាំង",en:"Strength"}};
K.NOINFO = {km:"ព័ត៌មានមិនគ្រប់",en:"Not enough info"}; // the owner's wording for a missing score

// top interest types as names (never letters), e.g. "ស្រាវជ្រាវ · រៀបរយ · ជាក់ស្តែង"
K.interestWords = P => P.code.map(t=>K.t(D.Q.RIASEC[t]));
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
// unlocks are saved as major ids at payment time, so changing answers can't reveal other majors
K.unlocked = (s, majorId) => K.isDemo() || K.SHOWCASE || (s.unlocked||[]).includes(majorId);
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

/* ---------- boot ---------- */
function boot(){
  K.load();
  applyStatic(); renderChrome(); showCookie(false);
}
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
