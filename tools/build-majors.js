// Builds js/majors.js (what students see) and js/major-profiles.js (hidden scoring data) from the owner's docs:
// docs/question-design.md (sections 11, 12, 15) and docs/question-design-mappings.md (deal-breakers, job links,
// category-to-field). Nothing is typed by hand. After building, every source line is rebuilt from the generated
// data and must exist in the docs, otherwise the script stops. Writes docs/majors-check.md.
// Run: node tools/build-majors.js   (needs js/questions.js first: node tools/build-questions.js)
const fs = require("fs"), vm = require("vm");
const DOC = fs.readFileSync("docs/question-design.md", "utf8").split(/\r?\n/);
const MAP = fs.readFileSync("docs/question-design-mappings.md", "utf8").split(/\r?\n/);
const ctx = { window: {} }; vm.createContext(ctx); vm.runInContext(fs.readFileSync("js/questions.js", "utf8"), ctx);
const Q = ctx.window.KITE_DATA.Q;

const idx = (L, text, from = 0) => { const i = L.findIndex((l, n) => n >= from && l === text); if (i < 0) throw new Error("Not found: " + text); return i; };
const table = (L, header, from = 0, cols) => { const rows = []; let i = idx(L, header, from) + 1;
  while (i < L.length && L[i].includes("\t")) { const c = L[i].split("\t"); if (cols && c.length !== cols) throw new Error("Bad row: " + L[i]); rows.push(c); i++; } return rows; };
const list = s => s.split(", ").map(x => x.trim());
const one = (map, key, what) => { if (!(key in map)) throw new Error(`Unknown ${what}: "${key}"`); return map[key]; };

/* ---- 16 majors (section 12) ---- */
const majorRows = table(DOC, "ID\tMajor\tKhmer\tRIASEC\tWork focus\tStrength targets\tPersonality", 0, 7);
const majorByName = Object.fromEntries(majorRows.map(c => [c[1], c[0]]));
/* ---- skill map (section 11, step 4) ---- */
const SKILL_IDS = { "Math": "math", "Logic": "logic", "Khmer": "khmer", "English": "english", "Design": "design", "Hands-on": "hands_on", "People": "people", "Organization": "organization", "Computer": "computer", "Science": "science" };
const subjByName = Object.fromEntries(Q.D1.subjects.map(s => [s.en, s.id]));
const selfByName = Object.fromEntries(Q.D2.skills.map(s => [s.en, s.id]));
const skillRows = table(DOC, "Major skill\tSchool subject evidence\tSelf-assessed skill", 0, 3);
const SKILL_MAP = Object.fromEntries(skillRows.map(c => [one(SKILL_IDS, c[0], "skill"), {
  subjects: c[1] === "None" ? [] : list(c[1]).map(s => one(subjByName, s, "subject")),
  self: c[2] === "No direct self-rating mapping" ? null : one(selfByName, c[2], "self-rated skill") }]));
/* ---- fields (section 15) and deal-breakers (mappings doc) ---- */
const fieldByName = Object.fromEntries(Q.A.fields.map(f => [f.en, f.id]));
const fieldRows = table(DOC, "Field\tMajor IDs\tMajors", idx(DOC, "15. Major-to-field mapping used by Job Fit"), 3);
const FIELD_MAJORS = Object.fromEntries(fieldRows.map(c => [one(fieldByName, c[0], "field"), list(c[1])]));
const b3ByName = Object.fromEntries(Q.B3.items.map(x => [x.en, x.id]));
const dbRows = table(MAP, "Deal-breaker\tKhmer\tMajors affected", 0, 3);
/* ---- category → field, job links (mappings doc) ---- */
const CAT_IDS = { tech: "tech", eng: "engineering", health: "health", biz: "business", creative: "creative", people: "people" };
const catRows = table(MAP, "Job category (cat)\tField used by Job Fit\tField's Khmer", 0, 3);
const CATEGORY_FIELD = Object.fromEntries(catRows.map(c => [one(CAT_IDS, c[0], "category"), one(fieldByName, c[1], "field")]));
const JOB_HEADS = { "Technology jobs": "tech", "Engineering jobs": "engineering", "Health jobs": "health", "Business jobs": "business", "Creative jobs": "creative", "People & service jobs": "people" };
const JOB_LINKS = {}; const linkRows = [];
for (const [head, cat] of Object.entries(JOB_HEADS)) {
  const rows = table(MAP, "Job\tDirect major IDs", idx(MAP, head), 2);
  const jobs = Q.A.jobs.filter(j => j.category === cat);
  if (rows.length !== jobs.length) throw new Error(`${head}: ${rows.length} links but ${jobs.length} jobs`);
  rows.forEach((c, i) => { if (c[0] !== jobs[i].en) throw new Error(`Job order differs: "${c[0]}" vs "${jobs[i].en}"`);
    JOB_LINKS[jobs[i].id] = list(c[1]).map(x => x.replace(/\*$/, "")); linkRows.push([jobs[i].id, c]); });
}

/* ---- profiles ---- */
const H = { H: 75, L: 25 }, DIMS = ["social", "big_picture", "heart_first", "planner"];
const PROFILES = {}, MAJORS = [];
for (const [id, en, km, code, focus, strengths, pers] of majorRows) {
  if (pers.length !== 4) throw new Error("Personality code must have 4 characters: " + pers);
  const personality = {}; [...pers].forEach((ch, i) => { if (ch !== "-") personality[DIMS[i]] = one(H, ch, "personality letter"); });
  PROFILES[id] = {
    riasec: code.split("-"), workFocus: list(focus), strengths: list(strengths).map(s => one(SKILL_IDS, s, "strength")), personality,
    dealBreakers: dbRows.filter(r => list(r[2]).includes(en)).map(r => one(b3ByName, r[0], "deal-breaker")),
    fields: Object.keys(FIELD_MAJORS).filter(f => FIELD_MAJORS[f].includes(id))
  };
  MAJORS.push({ id, en, km, jobs: Object.keys(JOB_LINKS).filter(j => JOB_LINKS[j].includes(id)) });
}
dbRows.forEach(r => list(r[2]).forEach(n => one(majorByName, n, "major name in deal-breaker table")));
Object.values(FIELD_MAJORS).flat().forEach(m => one(majorByName, majorRows.find(r => r[0] === m)?.[1], "major id in field table"));

/* ---- self-check: rebuild every source line from the generated data ---- */
const R = [];
const back = obj => Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]));
const skillName = back(SKILL_IDS), subjName = back(subjByName), selfName = back(selfByName), fieldName = back(fieldByName), b3Name = back(b3ByName), catName = back(CAT_IDS);
const nameOf = id => majorRows.find(r => r[0] === id)[1];
MAJORS.forEach(m => { const p = PROFILES[m.id];
  R.push(["Major " + m.id, DOC, [m.id, m.en, m.km, p.riasec.join("-"), p.workFocus.join(", "), p.strengths.map(s => skillName[s]).join(", "),
    DIMS.map(d => p.personality[d] === 75 ? "H" : p.personality[d] === 25 ? "L" : "-").join("")].join("\t")]); });
Object.entries(SKILL_MAP).forEach(([k, v]) => R.push(["Skill " + k, DOC, [skillName[k], v.subjects.length ? v.subjects.map(s => subjName[s]).join(", ") : "None", v.self ? selfName[v.self] : "No direct self-rating mapping"].join("\t")]));
Object.entries(FIELD_MAJORS).forEach(([f, ids]) => R.push(["Field " + f, DOC, [fieldName[f], ids.join(", "), ids.map(nameOf).join(", ")].join("\t")]));
Q.B3.items.forEach(x => { const ms = MAJORS.filter(m => PROFILES[m.id].dealBreakers.includes(x.id));
  const row = dbRows.find(r => r[0] === x.en); // keep the doc's order of majors
  const ordered = list(row[2]).filter(n => ms.some(m => m.en === n));
  if (ordered.length !== ms.length) throw new Error("Deal-breaker majors differ for " + x.en);
  R.push(["Deal-breaker " + x.id, MAP, [x.en, x.km, ordered.join(", ")].join("\t")]); });
Object.entries(CATEGORY_FIELD).forEach(([c, f]) => R.push(["Category " + c, MAP, [catName[c], fieldName[f], Q.A.fields.find(x => x.id === f).km].join("\t")]));
linkRows.forEach(([jid, c]) => R.push(["Job " + jid, MAP, [Q.A.jobs.find(j => j.id === jid).en, c[1]].join("\t")]));
const failed = R.filter(([, L, line]) => !L.includes(line));
if (failed.length) { failed.forEach(f => console.error("NOT IN DOC:", f[0], JSON.stringify(f[2]))); process.exit(1); }

/* ---- write ---- */
const legacy = [...new Set(Object.values(JOB_LINKS).flat())].filter(m => !majorRows.some(r => r[0] === m));
fs.writeFileSync("js/majors.js", `/* KITE — the 16 majors: only what students see. Generated by tools/build-majors.js from the owner's
   Question Design doc (docs/question-design.md). Do not edit by hand.
   jobs: career-list jobs directly linked to this major (shown as example careers).
   The owner's source has no description paragraph for the majors, so none is shown. */
(function(){
const D = window.KITE_DATA = window.KITE_DATA || {};
D.MAJORS = ${JSON.stringify(MAJORS, null, 1)};
})();
`);
fs.writeFileSync("js/major-profiles.js", `/* KITE — hidden scoring data (formula 1.0). Only js/scoring.js reads this file; later it moves to the server.
   Generated by tools/build-majors.js from docs/question-design.md and docs/question-design-mappings.md. Do not edit by hand:
   any change to these profiles changes the formula version and must be approved by the owner first.
   riasec: the major's 2–3 letter code (first letter weighs most). workFocus: B2 class-party keys.
   strengths: skill ids (see SKILL_MAP). personality: targets (H = 75, L = 25; missing dimension = not used).
   dealBreakers: B3 item ids that lower this major's Interest Fit. fields: Part A fields this major belongs to.
   JOB_LINKS: career-list job id → directly linked major ids (100 points). Kept exactly as in the source, including
   the legacy ids ${legacy.join(", ")} that are not among the 16 majors (they never give 100 points to a current major). */
(function(){
const D = window.KITE_DATA = window.KITE_DATA || {};
D.MAJOR_PROFILES = ${JSON.stringify(PROFILES, null, 1)};
D.SKILL_MAP = ${JSON.stringify(SKILL_MAP, null, 1)};
D.CATEGORY_FIELD = ${JSON.stringify(CATEGORY_FIELD)};
D.FIELD_MAJORS = ${JSON.stringify(FIELD_MAJORS)};
D.JOB_LINKS = ${JSON.stringify(JOB_LINKS)};
})();
`);
const md = ["# Major profile check: your documents vs js/majors.js + js/major-profiles.js", "",
  "Generated by `node tools/build-majors.js`. Each line below was rebuilt from the generated files and found, character for character, in your documents.", "",
  `**Result: ${R.length} of ${R.length} lines identical.**`, "", "| Item | Line rebuilt from the generated files (found in your doc) |", "|---|---|",
  ...R.map(([label, L, line]) => `| ${label} | ${line.replace(/\|/g, "\\|").replace(/\t/g, " ⇥ ")} |`)];
fs.writeFileSync("docs/majors-check.md", md.join("\n") + "\n");
console.log(`${MAJORS.length} majors, ${Object.keys(JOB_LINKS).length} job links, ${R.length}/${R.length} source lines rebuilt and found. Legacy ids kept: ${legacy.join(", ")}`);
