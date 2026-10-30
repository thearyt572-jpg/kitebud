/* KITE — scoring only: turns a student's answers into % matches for each major.
   No page code here. Reads the questions (js/questions.js), majors (js/majors.js)
   and the hidden major profiles (js/major-profiles.js). */
(function(){
const D = window.KITE_DATA;
const K = window.KITE = window.KITE || {};

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
const LETTER = {E:{km:"ចូលចិត្តជួបមនុស្ស",en:"outgoing"},I:{km:"ស្ងប់ស្ងាត់ និងគិតជ្រៅ",en:"quiet and reflective"},S:{km:"ជាក់ស្ដែង",en:"practical"},N:{km:"មើលរូបភាពធំ",en:"big-picture"},T:{km:"ប្រើហេតុផលមុន",en:"head-first"},F:{km:"ប្រើចិត្តមុន",en:"heart-first"},J:{km:"មានផែនការ",en:"a planner"},P:{km:"បត់បែន",en:"flexible"}};
K.RI_NAME = RI_NAME; K.LETTER = LETTER;

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
})();
