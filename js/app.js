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
function fresh(){ return {v:1,id:genId(),lang:"km",track:null,ans:{},cKnown:null,cType:"",pos:0,done:false,paid:null,unlocked:[],pkg:"B",checks:{},started:null}; }
K.load = function(){
  let s = safe(()=>JSON.parse(store().getItem(SKEY)||"null"), null)
       || safe(()=>JSON.parse(sessionStorage.getItem(SKEY)||"null"), null)
       || mem;
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
K.flap = (pct, size) => `<span class="flap ${size||"flap--md"} anim" aria-label="${pct}%">${String(pct).split("").concat("%").map(c=>`<span>${c}</span>`).join("")}</span>`;
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
    <p id="ck-p" class="small">${K.t("KITE ប្រើការផ្ទុកក្នុងកម្មវិធីរុករក (ខូគី) តែដើម្បីរក្សាចម្លើយ និងលទ្ធផលរបស់អ្នកនៅលើឧបករណ៍នេះ ដើម្បីឱ្យអ្នកអាចបន្តពេលក្រោយ។ យើងមិនប្រើខូគីសម្រាប់ការផ្សាយពាណិជ្ជកម្មទេ។ បើអ្នកបដិសេធ តេស្តនៅតែដំណើរការ ប៉ុន្តែចម្លើយនឹងបាត់ពេលអ្នកបិទផ្ទាំងនេះ។","KITE uses browser storage (cookies) only to keep your answers and results on this device, so you can continue later. We never use cookies for ads. If you decline, the test still works, but your answers disappear when you close this tab.")} <a href="privacy.html#cookies">${K.t("អានគោលការណ៍ឯកជនភាព","Read the privacy policy")}</a></p>
    ${now}
    <div class="cookie__btns"><button class="btn btn--ink" type="button" data-c="allow">${K.t("អនុញ្ញាត","Allow")}</button><button class="btn btn--ink" type="button" data-c="decline">${K.t("បដិសេធ","Decline")}</button></div>
  </div>`;
  el.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{ K.setConsent(b.dataset.c); el.hidden=true; K.toast(b.dataset.c==="allow"?K.t("ចម្លើយនឹងត្រូវរក្សាទុកនៅលើឧបករណ៍នេះ","Answers will be saved on this device"):K.t("ចម្លើយនឹងបាត់ពេលបិទផ្ទាំងនេះ","Answers will clear when you close this tab")); });
}
K.showCookie = showCookie;

/* ---------- words for the plain-language profile ---------- */
const RI_VERB = {R:{km:"ធ្វើការដោយដៃ និងឧបករណ៍",en:"working with your hands and tools"},I:{km:"ស្វែងយល់ និងដោះស្រាយបញ្ហា",en:"investigating and solving problems"},A:{km:"បង្កើតរបស់ថ្មីៗ",en:"creating new things"},S:{km:"ជួយមនុស្ស",en:"helping people"},E:{km:"ដឹកនាំ និងបញ្ចុះបញ្ចូល",en:"leading and persuading"},C:{km:"រៀបចំអ្វីៗឱ្យមានរបៀប",en:"organizing"}};
const TASK = {D:{km:"ទិន្នន័យ",en:"data"},I:{km:"គំនិត",en:"ideas"},P:{km:"មនុស្ស",en:"people"},T:{km:"ឧបករណ៍ និងវត្ថុ",en:"things and tools"}};
K.TASK = TASK;
K.PARTLABEL = {job:{km:"ការងារ",en:"Job"},interest:{km:"ចំណាប់អារម្មណ៍",en:"Interest"},pers:{km:"បុគ្គលិកលក្ខណៈ",en:"Personality"},strength:{km:"ចំណុចខ្លាំង",en:"Strength"}};

K.interestSentence = function(P){
  const top = Object.keys(P.ri).sort((a,b)=>P.ri[b]-P.ri[a]).slice(0,2);
  return K.lang()==="en" ? `You enjoy ${RI_VERB[top[0]].en} and ${RI_VERB[top[1]].en}.` : `អ្នកចូលចិត្ត${RI_VERB[top[0]].km} និង${RI_VERB[top[1]].km}។`;
};
K.persWords = P => P.type.split("").map(l=>K.t(K.LETTER[l]));
K.taskSentence = function(P){
  const top = Object.keys(P.tasks).sort((a,b)=>P.tasks[b]-P.tasks[a]).slice(0,2);
  return K.lang()==="en" ? `You lean toward work with ${TASK[top[0]].en} and ${TASK[top[1]].en}.` : `អ្នកចូលចិត្តការងារទាក់ទងនឹង${TASK[top[0]].km} និង${TASK[top[1]].km}។`;
};

/* ---------- unlocks & demo ---------- */
// unlocks are saved as major ids at payment time, so changing answers can't reveal other majors
K.unlocked = (s, majorId) => K.isDemo() || (s.unlocked||[]).includes(majorId);
K.unlock = (s, majorIds) => { s.unlocked = [...new Set([...(s.unlocked||[]), ...majorIds])]; };
K.demoState = function(){
  const s = fresh(); s.id="KT-DEMO-0000"; s.lang = K.lang(); s.track="sci"; s.done=true; s.paid="B"; s.cKnown=false;
  const like = {j2:4,j13:4,j4:3,j18:3,j11:3,j7:2,j1:2,j9:1,j3:1,j5:2,j6:1,j8:2,j10:1,j12:1,j14:2,j15:1,j16:1,j17:2};
  Object.entries(like).forEach(([k,v])=>s.ans[k]=v);
  const ri = {R:3,I:4,A:3,S:1,E:1,C:2};
  D.ACTS.forEach((a,i)=>s.ans[a.id]=Math.max(0,Math.min(4,ri[a.k]-(i%3===0?1:0))));
  ["c1","c5","c9"].forEach(id=>s.ans[id]=1); ["c2","c10"].forEach(id=>s.ans[id]=1); s.ans.c6=0;
  ["c3","c7","c11"].forEach(id=>s.ans[id]=0); ["c4","c8"].forEach(id=>s.ans[id]=0); s.ans.c12=1;
  const st = {math:4,sci:3,lang:2,comm:1,create:3,tech:4,org:2,care:1};
  D.SKILLS.forEach((q,i)=>s.ans[q.id]=Math.max(0,st[q.k]-(i>7&&q.k!=="math"?1:0)));
  return s;
};
K.state = () => K.isDemo() ? K.demoState() : K.load();

/* ---------- boot ---------- */
function boot(){
  K.load();
  applyStatic(); renderChrome(); showCookie(false);
  document.querySelectorAll("[data-price]").forEach(el=>el.textContent = K.price(el.dataset.price));
}
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
