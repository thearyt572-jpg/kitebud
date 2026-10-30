/* KITE — scoring only: turns a student's answers into % matches for each major. No page code here.
   FORMULA VERSION 1.0: the label the validation survey used (the source code called this same formula "2.1").
   The owner's validated formula, docs/question-design.md sections 10–15.
   Any change to questions, weights or major profiles changes the version and must be approved by the owner first.
   Reads js/questions.js (D.Q), js/majors.js (D.MAJORS) and the hidden js/major-profiles.js.
   Missing evidence is null, never zero: a null part is left out of the overall % and the weights are renormalised. */
(function(){
const D = window.KITE_DATA;
const K = window.KITE = window.KITE || {};
K.FORMULA_VERSION = "1.0";

// Weight of each part in the overall %. The about page and the report read this, so the text always matches.
const W = K.WEIGHTS = {job:.25, interest:.30, pers:.20, strength:.25};

const avg = a => a.length ? a.reduce((x,y)=>x+y,0)/a.length : null;
const has = v => v !== null && v !== undefined;
const DIMS = ["social","big_picture","heart_first","planner"];
const GRADE = {A:100, B:80, C:60, D:40, EF:20}; // "none" (Didn't study) is not included

/* ---------- Job Fit (Part A) ---------- */
// s.a = {mode:"job"|"field", job:jobId, custom:"text", field:fieldId|"none"}
function jobFit(s, majorId){
  const a = s.a || {};
  if(a.mode==="job" && a.job){
    const job = D.Q.A.jobs.find(j=>j.id===a.job); if(!job) return null;
    if((D.JOB_LINKS[job.id]||[]).includes(majorId)) return 100;                       // directly linked
    return (D.FIELD_MAJORS[D.CATEGORY_FIELD[job.category]]||[]).includes(majorId) ? 50 : 0; // same field / outside
  }
  // a typed-in job is not in the career list, so it has no links: no Job Fit (see the owner's open question)
  if(a.mode==="field" && a.field && a.field!=="none") return (D.FIELD_MAJORS[a.field]||[]).includes(majorId) ? 100 : 0;
  return null; // no dream job and no field
}

/* ---------- Interest Fit (B1, B2, B3) ---------- */
function riasec(s){ // normalised 0–1 per type: (average − 1) / 4
  const out = {};
  "RIASEC".split("").forEach(t=>{ const v = D.Q.B1.items.filter(x=>x.type===t).map(x=>s.b1&&s.b1[x.id]).filter(has); const m = avg(v); out[t] = m===null ? null : (m-1)/4; });
  return out;
}
function interestFit(s, p, T){
  const code = p.riasec.map(t=>T[t]); if(code.some(v=>v===null)) return null;
  const R = code.length===3 ? 100*(3*code[0]+2*code[1]+code[2])/6 : 100*(3*code[0]+2*code[1])/5;
  const b2 = s.b2 || {}, prefs = [];
  if(has(b2["b2-saturday"])) prefs.push(b2["b2-saturday"]===p.riasec[0] ? 100 : p.riasec.slice(1).includes(b2["b2-saturday"]) ? 50 : 0);
  if(has(b2["b2-class-party"])) prefs.push(p.workFocus.includes(b2["b2-class-party"]) ? 100 : 0);
  const P = prefs.length ? avg(prefs) : R;
  const k = Math.min(2, (s.b3||[]).filter(id=>p.dealBreakers.includes(id)).length);
  return (0.8*R + 0.2*P) * (1 - 0.15*k);
}

/* ---------- Personality (C) ---------- */
K.cleanType = v => String(v||"").toUpperCase().replace(/\s/g,"").replace(/-(A|T)$/,"");
K.validType = v => /^[EI][NS][TF][JP]$/.test(K.cleanType(v));
function personality(s){ // 0–100 per dimension, or null
  const c = s.c || {}, res = [];
  if(c.known==="yes" && K.validType(c.type)){
    const L = D.Q.C.letterScores, d = {};
    [...K.cleanType(c.type)].forEach(ch=>Object.assign(d, L[ch]));
    res.push(d);
  }
  const q = c.quiz || {}, pts = D.Q.C.quizPoints, d = {};
  DIMS.forEach(dim=>{
    const v = D.Q.C.quiz.filter(x=>x.dim===dim && has(q[x.id])).map(x=>{ const a = pts[q[x.id]]; return x.pole==="A" ? a : 100-a; });
    d[dim] = v.length===3 ? avg(v) : null;
  });
  if(DIMS.every(dim=>d[dim]!==null)) res.push(d);       // the quiz counts only if every dimension has all 3 answers
  if(!res.length) return null;
  return Object.fromEntries(DIMS.map(dim=>[dim, avg(res.map(r=>r[dim]))])); // type and quiz both done: average
}
function persFit(dims, p){
  if(!dims) return null;
  const v = Object.entries(p.personality).map(([dim,target])=>100-Math.abs(dims[dim]-target));
  return avg(v);
}

/* ---------- Strength Fit (D1, D2) ---------- */
function skillScore(s, skill){
  const m = D.SKILL_MAP[skill], g = (s.d1&&s.d1.grades)||{}, r = s.d2||{};
  const G = avg(m.subjects.map(sub=>GRADE[g[sub]]).filter(has));       // average of the studied subjects
  const S = m.self && has(r[m.self]) ? (r[m.self]-1)/4*100 : null;
  return G!==null && S!==null ? 0.6*G + 0.4*S : (G!==null ? G : S);
}
function strengthFit(s, p){ return avg(p.strengths.map(k=>skillScore(s,k)).filter(has)); }

/* ---------- Overall ---------- */
// Weighted average of the parts that are not null; null when nothing is usable ("Not enough info").
K.combine = parts => {
  let a = 0, b = 0; Object.keys(W).forEach(k=>{ if(has(parts[k])){ a += W[k]*parts[k]; b += W[k]; } });
  return b ? a/b : null;
};

K.profile = function(s){
  const T = riasec(s), dims = personality(s);
  const code = "RIASEC".split("").filter(t=>T[t]!==null).sort((x,y)=>T[y]-T[x]).slice(0,3);
  return {riasec:T, code, dims};
};
K.score = function(s){
  const P = K.profile(s);
  const out = D.MAJORS.map(m=>{
    const p = D.MAJOR_PROFILES[m.id]; // hidden scoring profile (js/major-profiles.js)
    const parts = {job:jobFit(s,m.id), interest:interestFit(s,p,P.riasec), pers:persFit(P.dims,p), strength:strengthFit(s,p)};
    const overall = K.combine(parts);
    const r = v => has(v) ? Math.round(v) : null;
    return {id:m.id, m, p, raw:overall, pct:r(overall), parts:{job:r(parts.job),interest:r(parts.interest),pers:r(parts.pers),strength:r(parts.strength)},
      dealBreakers:(s.b3||[]).filter(id=>p.dealBreakers.includes(id)), reasons:reasons(s,m,p,parts,P)};
  }).sort((x,y)=>(has(y.raw)-has(x.raw)) || (y.raw-x.raw) || ((y.parts.interest||0)-(x.parts.interest||0)));
  return {top:out.slice(0,3), all:out, profile:P};
};

// for tests/scoring-tests.html only
K._formula = {jobFit, riasec, interestFit, personality, persFit, skillScore, strengthFit};

/* ---------- "Why it matched" (page text built from the parts above; it does not change any score) ---------- */
// The interest type names students see, on every page (same words as the About page).
// The hidden type names in js/questions.js (locked) are not shown.
K.INTEREST_NAMES = {
  R:{km:"អ្នកធ្វើ",en:"Doer"}, I:{km:"អ្នកគិត",en:"Thinker"}, A:{km:"អ្នកបង្កើត",en:"Creator"},
  S:{km:"អ្នកជួយ",en:"Helper"}, E:{km:"អ្នកដឹកនាំ",en:"Persuader"}, C:{km:"អ្នករៀបចំ",en:"Organizer"}
};
function reasons(s, m, p, parts, P){
  const t = (km,en)=>({km,en}), out = [], a = s.a || {};
  if(parts.job===100 && a.mode==="job"){ const j = D.Q.A.jobs.find(x=>x.id===a.job);
    out.push(t(`ការងារក្នុងក្តីស្រមៃរបស់អ្នក «${j.km}» ភ្ជាប់ដោយផ្ទាល់ទៅនឹងជំនាញនេះ។`, `Your dream job “${j.en}” is directly linked to this major.`)); }
  if(parts.job===100 && a.mode==="field"){ const f = D.Q.A.fields.find(x=>x.id===a.field);
    out.push(t(`អ្នកបានជ្រើសវិស័យ «${f.km}» ដែលរួមមានជំនាញនេះ។`, `You chose the field “${f.en}”, which includes this major.`)); }
  const main = p.riasec[0];
  if(P.riasec[main]!==null && P.riasec[main]>=.6){ const n = K.INTEREST_NAMES[main];
    out.push(t(`អ្នកចូលចិត្តសកម្មភាពប្រភេទ «${n.km}» ដែលជាប្រភេទចំណាប់អារម្មណ៍សំខាន់របស់ជំនាញនេះ។`, `You enjoy “${n.en}” activities, this major's main interest type.`)); }
  if(has(parts.strength) && parts.strength>=75) out.push(t("និទ្ទេស និងការវាយតម្លៃខ្លួនឯងរបស់អ្នក ខ្លាំងលើជំនាញដែលជំនាញនេះត្រូវការ។","Your grades and self-ratings are strong in what this major needs."));
  if(has(parts.pers) && parts.pers>=80) out.push(t("ទំនោរបុគ្គលិកលក្ខណៈរបស់អ្នកសមនឹងជំនាញនេះ។","Your personality leanings fit this major."));
  return out.slice(0,3);
}
})();
