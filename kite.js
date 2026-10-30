/* KITE — core: storage & consent, language, header/footer/cookie banner, scoring. */
(function(){
const D = window.KITE_DATA;
const K = window.KITE = {};
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
function fresh(){ return {v:1,id:genId(),lang:"km",track:null,ans:{},cKnown:null,cType:"",pos:0,done:false,paid:null,pkg:"B",checks:{},started:null}; }
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
  document.documentElement.lang = en ? "en" : "km";
}
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

/* ---------- header, footer, cookie banner ---------- */
const NAV = [
  {href:"./",km:"ទំព័រដើម",en:"Home",page:"home"},
  {href:"./#how",km:"របៀបដំណើរការ",en:"How it works"},
  {href:"./#pricing",km:"តម្លៃ",en:"Pricing"}
];
function renderChrome(){
  const page = document.body.dataset.page;
  const h = document.getElementById("kite-header");
  const lang = K.lang();
  const links = NAV.map(n=>`<a href="${n.href}"${n.page===page?' aria-current="page"':""}>${K.t(n)}</a>`).join("");
  if(h){
    h.innerHTML = `<div class="topbar"><div class="wrap topbar__in">
      <a class="logo" href="./" aria-label="KITE — ${K.t("ទំព័រដើម","Home")}"><span class="logo__mark" aria-hidden="true">✈</span>KITE</a>
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
          <a class="logo" href="./"><span class="logo__mark" aria-hidden="true">✈</span>KITE</a>
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

/* ---------- scoring ---------- */
const PLUS = {EI:"E",SN:"N",TF:"F",JP:"J"};
const clamp = (x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const mean = arr => arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 3;
const fit = (m, avg) => .5*((m-1)/4) + .5*clamp(.5 + (m-avg)/2.5);
const pct = f => Math.round(35 + 63*clamp(f));
K.typeComplete = s => s.cKnown===true ? /^[EI][SN][TF][JP]$/.test(s.cType||"") : D.PERS.every(q=>s.ans[q.id]!==undefined);

K.profile = function(s){
  const r = id => s.ans[id]===undefined ? 3 : s.ans[id]+1;
  const jobs = {}; D.JOBS.forEach(j=>jobs[j.id]=r(j.id));
  const tasks = {D:[],I:[],P:[],T:[]};
  D.JOBS.forEach(j=>j.t.split("").forEach(t=>tasks[t].push(jobs[j.id])));
  Object.keys(tasks).forEach(k=>tasks[k]=mean(tasks[k]));
  const ri = {R:[],I:[],A:[],S:[],E:[],C:[]};
  D.ACTS.forEach(a=>ri[a.k].push(r(a.id)));
  Object.keys(ri).forEach(k=>ri[k]=mean(ri[k]));
  const st = {}; Object.keys(D.STRENGTHS).forEach(k=>st[k]=[]);
  D.SKILLS.forEach(q=>st[q.k].push(r(q.id)));
  Object.keys(st).forEach(k=>st[k]=mean(st[k]));
  const lean = {EI:0,SN:0,TF:0,JP:0};
  if(s.cKnown===true && /^[EI][SN][TF][JP]$/.test(s.cType||"")){
    const t = s.cType; ["EI","SN","TF","JP"].forEach((d,i)=>{ lean[d] = t[i]===PLUS[d] ? .67 : -.67; });
  } else {
    const cnt = {EI:0,SN:0,TF:0,JP:0};
    D.PERS.forEach(q=>{ const a=s.ans[q.id]; if(a===undefined) return; const letter = a===0?q.d[0]:q.d[1]; lean[q.d]+= letter===PLUS[q.d]?1:-1; cnt[q.d]++; });
    Object.keys(lean).forEach(d=>lean[d] = cnt[d] ? lean[d]/3 : 0);
  }
  const type = ["EI","SN","TF","JP"].map(d => lean[d]>=0 ? PLUS[d] : d.replace(PLUS[d],"")).join("");
  return {jobs,tasks,ri,st,lean,type,jobAvg:mean(Object.values(jobs)),riAvg:mean(Object.values(ri)),stAvg:mean(Object.values(st))};
};

const RI_NAME = {R:{km:"អ្នកធ្វើ (ធ្វើការដោយដៃ)",en:"Doer (hands-on)"},I:{km:"អ្នកគិត (ស្វែងយល់)",en:"Thinker (investigating)"},A:{km:"អ្នកបង្កើត (សិល្បៈ)",en:"Creator (artistic)"},S:{km:"អ្នកជួយ (សង្គម)",en:"Helper (social)"},E:{km:"អ្នកដឹកនាំ (បញ្ចុះបញ្ចូល)",en:"Persuader (enterprising)"},C:{km:"អ្នករៀបចំ (មានរបៀប)",en:"Organizer (conventional)"}};
const RI_VERB = {R:{km:"ធ្វើការដោយដៃ និងឧបករណ៍",en:"working with your hands and tools"},I:{km:"ស្វែងយល់ និងដោះស្រាយបញ្ហា",en:"investigating and solving problems"},A:{km:"បង្កើតរបស់ថ្មីៗ",en:"creating new things"},S:{km:"ជួយមនុស្ស",en:"helping people"},E:{km:"ដឹកនាំ និងបញ្ចុះបញ្ចូល",en:"leading and persuading"},C:{km:"រៀបចំអ្វីៗឱ្យមានរបៀប",en:"organizing"}};
const LETTER = {E:{km:"ចូលចិត្តជួបមនុស្ស",en:"outgoing"},I:{km:"ស្ងប់ស្ងាត់ និងគិតជ្រៅ",en:"quiet and reflective"},S:{km:"ជាក់ស្ដែង",en:"practical"},N:{km:"មើលរូបភាពធំ",en:"big-picture"},T:{km:"ប្រើហេតុផលមុន",en:"head-first"},F:{km:"ប្រើចិត្តមុន",en:"heart-first"},J:{km:"មានផែនការ",en:"a planner"},P:{km:"បត់បែន",en:"flexible"}};
const TASK = {D:{km:"ទិន្នន័យ",en:"data"},I:{km:"គំនិត",en:"ideas"},P:{km:"មនុស្ស",en:"people"},T:{km:"ឧបករណ៍ និងវត្ថុ",en:"things and tools"}};
K.RI_NAME = RI_NAME; K.TASK = TASK; K.LETTER = LETTER;
K.PARTLABEL = {job:{km:"ការងារ",en:"Job"},interest:{km:"ចំណាប់អារម្មណ៍",en:"Interest"},pers:{km:"បុគ្គលិកលក្ខណៈ",en:"Personality"},strength:{km:"ចំណុចខ្លាំង",en:"Strength"}};

K.score = function(s){
  const P = K.profile(s);
  const out = D.MAJORS.map(m=>{
    const pr = D.MAJOR_PROFILES[m.id]; // hidden scoring profile (js/major-profiles.js)
    const jm = mean(pr.jobs.map(j=>P.jobs[j]));
    const wsum = (w, v) => { let a=0,b=0; Object.keys(w).forEach(k=>{a+=w[k]*v[k];b+=w[k];}); return a/b; };
    const im = wsum(pr.ri, P.ri), sm = wsum(pr.s, P.st);
    const pf = 1 - mean(Object.keys(pr.p).map(d=>Math.abs(P.lean[d]-pr.p[d])))/2;
    const f = {job:fit(jm,P.jobAvg), interest:fit(im,P.riAvg), pers:pf, strength:fit(sm,P.stAvg)};
    const overall = .3*f.job + .3*f.interest + .15*f.pers + .25*f.strength;
    // reasons
    const rs = [];
    pr.jobs.forEach(j=>{ const v=P.jobs[j]; if(v>=4){ const job=D.JOBS.find(x=>x.id===j); rs.push({w:v+.2, km:`អ្នកបានជ្រើសថាចង់ធ្វើការជា «${job.km}»`, en:`You said you'd like to work as a ${job.en.toLowerCase()}`}); }});
    Object.keys(pr.ri).forEach(k=>{ const v=P.ri[k]; if(v>=3.5 && pr.ri[k]>=.5) rs.push({w:v*pr.ri[k], km:`ចំណាប់អារម្មណ៍ខ្លាំងប្រភេទ ${RI_NAME[k].km}`, en:`Strong ${RI_NAME[k].en} interest`}); });
    Object.keys(pr.s).forEach(k=>{ const v=P.st[k]; if(v>=3.5 && pr.s[k]>=.5) rs.push({w:v*pr.s[k], km:`អ្នកវាយតម្លៃខ្លួនឯងថាពូកែផ្នែក${D.STRENGTHS[k].km}`, en:`You rated yourself strong in ${D.STRENGTHS[k].en.toLowerCase()}`}); });
    Object.keys(pr.p).forEach(d=>{ const u=P.lean[d], p=pr.p[d]; if(Math.abs(p)>=.4 && Math.abs(u)>=.3 && Math.sign(u)===Math.sign(p)){ const L = u>0?PLUS[d]:d.replace(PLUS[d],""); rs.push({w:3+Math.abs(u), km:`លក្ខណៈ «${LETTER[L].km}» របស់អ្នកសមនឹងជំនាញនេះ`, en:`Being ${LETTER[L].en} suits this major`}); }});
    rs.sort((a,b)=>b.w-a.w);
    return {id:m.id, m, pct:pct(overall), parts:{job:pct(f.job),interest:pct(f.interest),pers:pct(f.pers),strength:pct(f.strength)}, reasons:rs.slice(0,3)};
  }).sort((a,b)=>b.pct-a.pct || b.parts.interest-a.parts.interest);
  return {top:out.slice(0,3), all:out, profile:P};
};

K.interestSentence = function(P){
  const top = Object.keys(P.ri).sort((a,b)=>P.ri[b]-P.ri[a]).slice(0,2);
  return K.lang()==="en" ? `You enjoy ${RI_VERB[top[0]].en} and ${RI_VERB[top[1]].en}.` : `អ្នកចូលចិត្ត${RI_VERB[top[0]].km} និង${RI_VERB[top[1]].km}។`;
};
K.persWords = P => P.type.split("").map(l=>K.t(LETTER[l]));
K.taskSentence = function(P){
  const top = Object.keys(P.tasks).sort((a,b)=>P.tasks[b]-P.tasks[a]).slice(0,2);
  return K.lang()==="en" ? `You lean toward work with ${TASK[top[0]].en} and ${TASK[top[1]].en}.` : `អ្នកចូលចិត្តការងារទាក់ទងនឹង${TASK[top[0]].km} និង${TASK[top[1]].km}។`;
};

/* ---------- unlocks & demo ---------- */
K.unlocked = (s, rank) => K.isDemo() || s.paid==="B" || (s.paid==="A" && rank===3);
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
}
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
