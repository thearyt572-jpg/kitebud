// Builds js/questions.js from the owner's Question Design doc (docs/question-design.md).
// The question wording is never typed by hand: every text below is read from the doc.
// Run: node tools/build-questions.js
const fs = require("fs");
const DOC = "docs/question-design.md", OUT = "js/questions.js";
const L = fs.readFileSync(DOC, "utf8").split(/\r?\n/);

/* ---------- small readers ---------- */
const idx = (text, from = 0) => { const i = L.findIndex((l, n) => n >= from && l === text); if (i < 0) throw new Error("Not found in doc: " + text); return i; };
const between = (start, end) => [idx(start), idx(end, idx(start))];
// rows of a tab table that starts right after the header line `header` (searched from line `from`)
function table(header, from = 0, cols) {
  const rows = []; let i = idx(header, from) + 1;
  while (i < L.length && L[i].includes("\t")) { const c = L[i].split("\t"); if (cols && c.length !== cols) throw new Error("Row has " + c.length + " columns: " + L[i]); rows.push(c); i++; }
  return rows;
}
// "- English: …" / "- Khmer: …" pairs between two line numbers
function pairs(a, b) {
  const out = [];
  for (let i = a; i < b; i++) if (L[i].startsWith("- English: ")) {
    if (!L[i + 1].startsWith("- Khmer: ")) throw new Error("No Khmer after: " + L[i]);
    out.push({ en: L[i].slice(11), km: L[i + 1].slice(9) });
  }
  return out;
}
const KHMER = /[ក-៿]/;
// "English text / Khmer text": split at the " / " that comes right before the Khmer
function splitEnKm(s) { const i = [...s.matchAll(/ \/ /g)].map(m => m.index).find(i => KHMER.test(s[i + 3])); if (i == null) throw new Error("No English / Khmer split: " + s); return { en: s.slice(0, i), km: s.slice(i + 3) }; }
const NEEDS = "[NEEDS KHMER]";
const pad = n => String(n).padStart(2, "0");

/* ---------- Part A ---------- */
const [a0, a1] = between("2. Part A — Dream job or field", "3. Career list — selectable dream jobs");
const aPairs = pairs(a0, a1); // question, option 1, option 2, "I really don't know yet"
const CAT_IDS = ["tech", "engineering", "health", "business", "creative", "people"];
const categories = table("Category\tKhmer", a0, 2).map((c, i) => ({ id: CAT_IDS[i], en: c[0], km: c[1] }));
const FIELD_IDS = ["science", "technology", "engineering", "health", "business", "creative", "people"];
const fields = table("Field\tKhmer\tExamples", a0, 3).map((c, i) => ({ id: FIELD_IDS[i], en: c[0], km: c[1], examples: splitEnKm(c[2]) }));
const [j0, j1] = between("3. Career list — selectable dream jobs", "4. Part B1 — Interest questionnaire (30 activities)");
const JOB_HEADS = { "Technology": "tech", "Engineering": "engineering", "Health": "health", "Business & money": "business", "Creative & design": "creative", "People & service": "people" };
const jobs = [];
for (const [head, cat] of Object.entries(JOB_HEADS)) {
  const h = idx(head, j0); if (h > j1) throw new Error("Job group outside section: " + head);
  if (L[h + 1] !== "English\tKhmer") throw new Error("No table under " + head);
  table("English\tKhmer", h, 2).forEach(c => jobs.push({ id: cat + "-" + pad(jobs.filter(j => j.category === cat).length + 1), category: cat, en: c[0], km: c[1] }));
}

/* ---------- B1 ---------- */
const [b0, b1end] = between("4. Part B1 — Interest questionnaire (30 activities)", "5. Part B2 — Quick preference questions");
const b1Pairs = pairs(b0, idx("Attention-check item", b0)); // the two instruction lines (the attention item is not used: owner's decision)
const b1Items = table("No.\tActivity (English)\tសកម្មភាព (Khmer)\tType", b0, 4).map(c => ({ id: "b1-" + pad(+c[0]), en: c[1], km: c[2], type: c[3] }));
const riasec = Object.fromEntries(table("Code\tEnglish\tKhmer", b0, 3).map(c => [c[0], { en: c[1], km: c[2] }]));
const b1Scale = table("Score\tEnglish\tKhmer", b0, 3).map(c => ({ value: +c[0], en: c[1], km: c[2] }));

/* ---------- B2 ---------- */
const [c0, c1] = between("5. Part B2 — Quick preference questions", "6. Part B3 — Deal-breakers");
const b2Pairs = pairs(c0, c1);
const q1opts = table("Option\tEnglish\tKhmer", c0, 3);
const q2opts = table("Option\tEnglish\tKhmer", idx("Question 2", c0), 3);
const b2 = [
  { id: "b2-saturday", en: b2Pairs[0].en, km: b2Pairs[0].km, key: "riasec", options: q1opts.map(c => ({ id: "b2-saturday-" + c[0], key: c[0], en: c[1], km: c[2] })) },
  { id: "b2-class-party", en: b2Pairs[1].en, km: b2Pairs[1].km, key: "work_focus", options: q2opts.map(c => ({ id: "b2-class-party-" + c[0].toLowerCase(), key: c[0], en: c[1], km: c[2] })) }
];

/* ---------- B3 ---------- */
const [d0, d1] = between("6. Part B3 — Deal-breakers", "7. Part C — Personality questionnaire");
const b3Instr = pairs(d0, d1)[0];
const b3Items = table("No.\tEnglish\tKhmer", d0, 3).map(c => ({ id: "b3-" + pad(+c[0]), en: c[1], km: c[2] }));

/* ---------- C: personality ---------- */
const [e0, e1] = between("7. Part C — Personality questionnaire", "8. Part D1 — School results");
const cIntro = pairs(e0, e1)[0];
const cOpts = table("Option\tEnglish\tKhmer", e0, 3).map((c, i) => ({ id: i ? "no" : "yes", en: c[1], km: c[2] }));
const cLabels = table("English\tKhmer", e0, 2).map(c => ({ en: c[0], km: c[1] }));
// Hidden scoring direction of each quiz item: from the owner's Part C table ("Dimension (A = pole)").
// dim: social | big_picture | heart_first | planner; pole: the side that scores 100 on that dimension.
const POLES = [["social","A"],["social","B"],["social","A"],["big_picture","B"],["big_picture","A"],["big_picture","B"],
               ["heart_first","B"],["heart_first","A"],["heart_first","B"],["planner","A"],["planner","B"],["planner","A"]];
const quiz = table("No.\tQuestion (English)\tសំណួរ (Khmer)\tA\tB", e0, 5).map((c, i) => ({ id: "c-" + pad(+c[0]), en: c[1], km: c[2], a: splitEnKm(c[3]), b: splitEnKm(c[4]), dim: POLES[i][0], pole: POLES[i][1] }));
const DIM_IDS = ["social", "big_picture", "heart_first", "planner"];
const dims = table("Dimension\tFirst side\tSecond side", e0, 3).map((c, i) => {
  const side = s => { const [en, km] = s.split(" — "); return { en, km }; };
  return { id: DIM_IDS[i], en: c[0], high: side(c[1]), low: side(c[2]) };
});
const quizScale = table("Score\tEnglish", e0, 2).map(c => ({ value: +c[0], en: c[1], km: NEEDS }));

/* ---------- D1 ---------- */
const [f0, f1] = between("8. Part D1 — School results", "9. Part D2 — Self-assessed skills");
const d1Pairs = pairs(f0, f1); // grade question, track question
const SUBJ_IDS = ["math", "physics", "chemistry", "biology", "khmer", "english", "ict"];
const subjects = table("English\tKhmer", f0, 2).map((c, i) => ({ id: SUBJ_IDS[i], en: c[0], km: c[1] }));
const GRADE_IDS = ["A", "B", "C", "D", "EF", "none"];
const grades = table("Option\tMeaning", f0, 2).map((c, i) => ({ id: GRADE_IDS[i], en: c[0], km: c[1] }));
const tracks = table("English\tKhmer", idx("High-school track", f0), 2).map((c, i) => ({ id: i ? "social" : "science", en: c[0], km: c[1] }));

/* ---------- D2 ---------- */
const [g0, g1] = between("9. Part D2 — Self-assessed skills", "10. Interest Fit — finalized formula from the existing code");
const d2Q = pairs(g0, g1)[0];
const SKILL_IDS = ["math", "logic", "khmer", "english", "design", "hands_on", "people", "organization", "computer"];
const skills = table("No.\tEnglish\tKhmer", g0, 3).map((c, i) => ({ id: SKILL_IDS[i], en: c[1], km: c[2] }));
const d2Scale = table("Score\tEnglish\tKhmer", g0, 3).map(c => ({ value: +c[0], en: c[1], km: c[2] }));

/* ---------- write ---------- */
const Q = {
  A: { question: aPairs[0], options: [{ id: "job", ...aPairs[1] }, { id: "field", ...aPairs[2] }], dontKnow: aPairs[3], categories, fields, jobs, customJobAllowed: true },
  B1: { instructions: b1Pairs, scale: b1Scale, items: b1Items, mixedOrder: true },
  RIASEC: riasec,
  B2: b2,
  B3: { instruction: b3Instr, items: b3Items, optional: true },
  C: { intro: cIntro, options: cOpts, typeLabel: cLabels[0], typeExample: cLabels[1], alsoQuiz: cLabels[2], quiz, quizScale, dimensions: dims,
       quizPoints: [100, 67, 33, 0], letterScores: { E: { social: 80 }, I: { social: 20 }, N: { big_picture: 80 }, S: { big_picture: 20 }, F: { heart_first: 80 }, T: { heart_first: 20 }, J: { planner: 80 }, P: { planner: 20 } } },
  D1: { question: d1Pairs[0], subjects, grades, trackQuestion: d1Pairs[1], tracks },
  D2: { question: d2Q, skills, scale: d2Scale, optional: true }
};
const js = `/* LOCKED: validated questions. Do not edit without approval.
   KITE question bank, generated by tools/build-questions.js from the owner's Question Design doc
   (docs/question-design.md). Do not edit this file by hand: change the doc, get approval, re-run the tool.
   Text marked ${NEEDS} has no approved Khmer yet; the English is shown instead.
   Hidden scoring keys (type, key, dim, pole, letterScores) are read only by js/scoring.js and never shown.
   Not used in the MVP (owner's decision): the B1 attention-check item, the C2 group role. */
(function(){
const D = window.KITE_DATA = window.KITE_DATA || {};
D.Q = ${JSON.stringify(Q, null, 1)};
})();
`;
fs.writeFileSync(OUT, js);
console.log(`wrote ${OUT}: ${jobs.length} jobs, ${fields.length} fields, ${b1Items.length} B1, ${b2.length} B2, ${b3Items.length} B3, ${quiz.length} quiz, ${subjects.length} subjects, ${skills.length} skills`);
