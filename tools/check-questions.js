// Checks js/questions.js against the owner's doc and writes docs/questions-check.md (side-by-side table).
// For every item it rebuilds the doc's exact table line from the values in questions.js and looks for that
// line in docs/question-design.md, in the same order. Any difference is reported as ✗.
// Run: node tools/check-questions.js
const fs = require("fs"), vm = require("vm");
const DOC = fs.readFileSync("docs/question-design.md", "utf8").split(/\r?\n/);
const ctx = { window: {} }; vm.createContext(ctx); vm.runInContext(fs.readFileSync("js/questions.js", "utf8"), ctx);
const Q = ctx.window.KITE_DATA.Q;

let bad = 0, total = 0; const md = [];
const esc = s => String(s).replace(/\|/g, "\\|").replace(/\t/g, " ⇥ ");
// find `line` in the doc after line number `after`; return its line number or -1
function check(section, rows) {
  md.push(`\n## ${section}\n\n| # | Your document (exact line) | questions.js (what the site uses) | Same? |\n|---|---|---|---|`);
  let last = -1;
  rows.forEach(([label, docLine, shown]) => {
    total++;
    const at = DOC.findIndex((l, i) => i > last && l === docLine);
    const ok = at >= 0; if (ok) last = at; else bad++;
    md.push(`| ${label} | ${ok ? esc(DOC[at]) : "**NOT FOUND:** " + esc(docLine)} | ${esc(shown)} | ${ok ? "✓" : "✗"} |`);
  });
}
const pair = p => [["- English: " + p.en, p.en], ["- Khmer: " + p.km, p.km]];
const pairRows = (name, p) => pair(p).map(([d, s], i) => [name + (i ? " (km)" : " (en)"), d, s]);
const n = i => String(i + 1);

// Part A
check("Part A — question and options", [
  ...pairRows("Question", Q.A.question), ...pairRows("Option 1", Q.A.options[0]), ...pairRows("Option 2", Q.A.options[1])]);
check("Part A — six career categories", Q.A.categories.map(c => [c.id, `${c.en}\t${c.km}`, `${c.en} / ${c.km}`]));
check("Part A — fields (one choice if unsure)", [
  ...Q.A.fields.map(f => [f.id, `${f.en}\t${f.km}\t${f.examples.en} / ${f.examples.km}`, `${f.en} / ${f.km} — ${f.examples.en} / ${f.examples.km}`]),
  ...pairRows("Don't know", Q.A.dontKnow)]);
check(`Part A — career list (${Q.A.jobs.length} jobs)`, Q.A.jobs.map(j => [j.id, `${j.en}\t${j.km}`, `${j.en} / ${j.km}`]));
// B1
check("B1 — instructions", Q.B1.instructions.flatMap((p, i) => pairRows("Line " + n(i), p)));
check("B1 — 30 activities (shown in mixed order; type hidden)", Q.B1.items.map((x, i) => [x.id, `${n(i)}\t${x.en}\t${x.km}\t${x.type}`, `${x.en} / ${x.km} [hidden: ${x.type}]`]));
check("B1 — RIASEC types (hidden)", Object.entries(Q.RIASEC).map(([k, v]) => [k, `${k}\t${v.en}\t${v.km}`, `${v.en} / ${v.km}`]));
check("B1 — rating scale", Q.B1.scale.map(s => [s.value, `${s.value}\t${s.en}\t${s.km}`, `${s.en} / ${s.km}`]));
// B2
Q.B2.forEach((q, i) => check(`B2 — Question ${i + 1}`, [
  ...pairRows("Question", q), ...q.options.map(o => [o.key, `${o.key}\t${o.en}\t${o.km}`, `${o.en} / ${o.km} [hidden: ${o.key}]`])]));
// B3
check("B3 — deal-breakers (optional)", [...pairRows("Instruction", Q.B3.instruction),
  ...Q.B3.items.map((x, i) => [x.id, `${n(i)}\t${x.en}\t${x.km}`, `${x.en} / ${x.km}`])]);
// C
check("C — personality introduction and labels", [...pairRows("Intro", Q.C.intro),
  ...Q.C.options.map((o, i) => [o.id, `${n(i)}\t${o.en}\t${o.km}`, `${o.en} / ${o.km}`]),
  ...[Q.C.typeLabel, Q.C.typeExample, Q.C.alsoQuiz].map(l => ["label", `${l.en}\t${l.km}`, `${l.en} / ${l.km}`])]);
check("C — 12-question quiz (hidden: dimension and pole)", Q.C.quiz.map((x, i) => [x.id,
  `${n(i)}\t${x.en}\t${x.km}\t${x.a.en} / ${x.a.km}\t${x.b.en} / ${x.b.km}`,
  `${x.en} / ${x.km} — A: ${x.a.en} / ${x.a.km} — B: ${x.b.en} / ${x.b.km} [hidden: ${x.dim}, pole ${x.pole}]`]));
check("C — four dimensions", Q.C.dimensions.map(d => [d.id, `${d.en}\t${d.high.en} — ${d.high.km}\t${d.low.en} — ${d.low.km}`, `${d.en}: ${d.high.en} / ${d.low.en}`]));
check("C — quiz answer scale", Q.C.quizScale.map(s => [s.value, `${s.value}\t${s.en}`, `${s.en} / ${s.km}`]));
// D1
check("D1 — school results", [...pairRows("Question", Q.D1.question),
  ...Q.D1.subjects.map(s => [s.id, `${s.en}\t${s.km}`, `${s.en} / ${s.km}`]),
  ...Q.D1.grades.map(g => [g.id, `${g.en}\t${g.km}`, `${g.en} / ${g.km}`]),
  ...pairRows("Track question", Q.D1.trackQuestion), ...Q.D1.tracks.map(t => [t.id, `${t.en}\t${t.km}`, `${t.en} / ${t.km}`])]);
// D2
check("D2 — self-assessed skills (optional)", [...pairRows("Question", Q.D2.question),
  ...Q.D2.skills.map((s, i) => [s.id, `${n(i)}\t${s.en}\t${s.km}`, `${s.en} / ${s.km}`]),
  ...Q.D2.scale.map(s => [s.value, `${s.value}\t${s.en}\t${s.km}`, `${s.en} / ${s.km}`])]);

// extra checks that a line match can't show
const extra = [];
const types = Q.B1.items.reduce((a, x) => (a[x.type] = (a[x.type] || 0) + 1, a), {});
extra.push(["B1 has 5 items of each type R I A S E C", Object.values(types).every(v => v === 5) && Object.keys(types).join("") === "RIASEC"]);
extra.push(["Quiz has 3 items per dimension", ["social", "big_picture", "heart_first", "planner"].every(d => Q.C.quiz.filter(x => x.dim === d).length === 3)]);
extra.push(["Quiz poles match the owner's Part C table (A,B,A · B,A,B · B,A,B · A,B,A)", Q.C.quiz.map(x => x.pole).join("") === "ABABABBABABA"]);
extra.push(["Only the 4 quiz scale labels are marked [NEEDS KHMER]", JSON.stringify(Q).split("[NEEDS KHMER]").length - 1 === 4]);
extra.push(["Attention-check item is not in questions.js", !JSON.stringify(Q).includes("To show you're reading")]);
extra.forEach(([t, ok]) => { total++; if (!ok) bad++; });

const head = [`# Question check: your document vs js/questions.js`, ``,
  `Generated by \`node tools/check-questions.js\`. **Left column:** the exact line from your Question Design doc (\`docs/question-design.md\`).`,
  `**Middle column:** what \`js/questions.js\` contains. A ✓ means the line rebuilt from questions.js is identical, character for character,`,
  `to the line in your doc, and appears in the same order. (⇥ marks a table-column break in your doc.)`, ``,
  `**Result: ${total - bad} of ${total} checks passed${bad ? ` — ${bad} FAILED` : ""}.**`, ``,
  `Please also confirm that \`docs/question-design.md\` is identical to the document you sent (it was saved from your message).`, ``,
  `| Extra check | Result |`, `|---|---|`, ...extra.map(([t, ok]) => `| ${t} | ${ok ? "✓" : "✗"} |`)];
fs.writeFileSync("docs/questions-check.md", head.join("\n") + "\n" + md.join("\n") + "\n");
console.log(`${total - bad}/${total} checks passed` + (bad ? `, ${bad} FAILED` : ""));
process.exit(bad ? 1 : 0);
