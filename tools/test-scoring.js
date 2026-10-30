// Runs tests/scoring-tests.js in Node. Run: node tools/test-scoring.js
const fs = require("fs"), vm = require("vm");
const ctx = { window: {}, console }; ctx.window.window = ctx.window; vm.createContext(ctx);
for (const f of ["js/questions.js", "js/majors.js", "js/major-profiles.js", "js/scoring.js", "tests/scoring-tests.js"])
  vm.runInContext(fs.readFileSync(f, "utf8"), ctx, { filename: f });
const res = vm.runInContext("window.KITE_TEST_RESULTS()", ctx);
res.forEach(r => console.log((r.ok ? "PASS " : "FAIL ") + r.name + (r.ok ? "" : `\n     got ${JSON.stringify(r.actual)}, expected ${JSON.stringify(r.expected)}`)));
const bad = res.filter(r => !r.ok).length;
console.log(`\n${res.length - bad} of ${res.length} checks passed` + (bad ? ` — ${bad} FAILED` : ""));
process.exit(bad ? 1 : 0);
