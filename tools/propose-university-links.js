// PROPOSAL ONLY: suggests which of the 16 majors each university program links to, and applies the owner's rules
// (Phnom Penh, bachelor only, per-year fees, removals, IFL price only on IFL). Writes docs/university-linking.md for
// the owner to approve. Changes nothing on the site.
// Sources:
//   docs/university-sheet.csv (the owner's Google Sheet, saved by tools/fetch-university-sheet.js): program NAMES,
//     exactly as written (owner's rule 2026-10-30: keep the names as the sheet has them, no translating or spelling fixes)
//   archive/my-version/js/universities.js: the earlier conversion of the same sheet (prices, degree types, notes).
//     Each of its rows says which sheet row it came from ("Sheet row 169"); a changed price text is flagged.
// All 15 universities are in Phnom Penh (owner, 2026-10-30).
// Run: node tools/fetch-university-sheet.js && node tools/propose-university-links.js
const fs = require("fs"), vm = require("vm");
const c = { window: {} }; vm.createContext(c);
vm.runInContext(fs.readFileSync("archive/my-version/js/universities.js", "utf8") + ";window.R = UNIVERSITY_PROGRAMS;", c);
vm.runInContext(fs.readFileSync("js/majors.js", "utf8"), c);
const MAJORS = c.window.KITE_DATA.MAJORS;
const CITY = "Phnom Penh";

// the sheet as rows of cells (quoted cells may hold commas and line breaks)
function csv(text) {
  const rows = []; let row = [], f = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += ch; }
    else if (ch === '"') q = true;
    else if (ch === ",") { row.push(f); f = ""; }
    else if (ch === "\n") { row.push(f.replace(/\r$/, "")); rows.push(row); row = []; f = ""; }
    else f += ch;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  return rows;
}
const SHEET = csv(fs.readFileSync("docs/university-sheet.csv", "utf8"));
const clean = s => String(s || "").replace(/\s+/g, " ").trim();
const rowOf = r => +((r.notes || "").match(/Sheet rows? (\d+)/) || [])[1];
const ROWS = c.window.R.filter(r => !r.isSample).map(r => {
  const s = SHEET[rowOf(r) - 1] || [];
  const oldPrice = clean(((r.tuitionNotes || "").match(/^Sheet: ([^·]*)/) || [])[1]);
  return { ...r, sheetRow: rowOf(r), sheetName: clean(s[2]) || null, priceChanged: !!(oldPrice && clean(s[3]) !== oldPrice) };
});

// keyword → major id (English and Khmer names). A program can match more than one major. Order doesn't matter.
const LINKS = [
  ["ds", /data science|data analytics|analytics|business intelligence|artificial intelligence|\(ai\)|\bai\b|machine/i],
  ["it", /computer science|software|information technology|information (and|&) communication|\bict\b|digital technology|app design|programming|information system|computer multimedia|digital infrastructure|artificial intelligence|\bai\b|machine|ព័ត៌មានវិទ្យា/i],
  ["cy", /cyber|networking|network engineering|telecommunications and network|computer network/i],
  ["ee", /electric|electronic|telecommunication|energy|automation|robotic|អគ្គិសនី|អេឡិចត្រូនិក/i],
  ["ce", /civil|construction|structural|bridge|road design|hydraulic|infrastructure engineering|transport and infrastructure|water resources|geotechnical|building design|សំណង់ស៊ីវិល/i],
  ["ar", /architect|interior design|urban planning|urbanization|smart city planning|ស្ថាបត្យកម្ម/i],
  ["md", /medicine|dentistry/i],
  ["nu", /nursing|midwifery|physiotherap/i],
  ["ac", /accounting|auditing|taxation|fiscal revenue|គណនេយ្យ/i],
  ["fi", /financ|banking|insurance|investment|security market|ធនាគារ|ហិរញ្ញវត្ថុ/i],
  ["mk", /marketing|business administrat|business management|^management$|general management|e-commerce|digital business|entrepreneur|international business|branding|commercial property|real estate|media management|^communication$|media and communications|ទីផ្សារ|គ្រប់គ្រងធុរកិច្ច|គ្រប់គ្រងពាណិជ្ចកម្ម/i],
  ["hr", /human resource/i],
  ["lw", /\blaws?\b|legal|justice|ilaw|នីតិសាស្ត្រ|នីតិសាស្រ្ត|ច្បាប់/i],
  ["gd", /graphic|multimedia|digital design|digital arts|field of design|creative/i],
  ["ho", /tourism|hospitality|hotel|ទេសចរណ៍|សណ្ឋាគារ|បដិសណ្ឋារកិច្ច/i],
  ["ed", /education|teaching english|tesol|curriculum|lifelong learning/i]
];
// owner's rules: not bachelor → removed from KITE (shown in the table, not on the site)
function removal(r) {
  const n = r.programNameEn || "", t = r.programType || "";
  if (/associate/i.test(t)) return "Associate degree (2-year), not a bachelor";
  if (/master/i.test(n)) return "Master's degree, not a bachelor";
  if (/english preparatory|english for academic success|professional advanced|international exchange/i.test(n)) return "Not a bachelor degree program";
  if (r.universityId === "norton" && /^(Nursing|Midwifery|Medical-Lab Technology)$/.test(n)) return "Sheet notes: separate from the bachelor with different fees, likely not a bachelor (associate)";
  return null;
}
// owner's decisions on single rows (by sheet row number)
const OWNER_UNLINK = { 178: { majors: ["it"], why: "Owner (31/10/2026): don't link to IT / Software Engineering" } }; // RULE សេដ្ឋកិច្ចព័ត៌មានវិទ្យា
const isIFL = r => /Listed under 'IFL'/.test(r.notes || "");
function price(r) {
  // owner (31/10/2026): $450–$590 is per year and belongs to IFL itself, not to the 7 programs listed under it
  if (isIFL(r)) return { text: "—", shown: false, flag: "Listed under IFL: the IFL fee ($450–$590 / year) is not shown on this program (owner)" };
  if (r.tuitionMin == null) return { text: "—", shown: false, flag: "" };
  const t = "$" + r.tuitionMin + (r.tuitionMax ? "–$" + r.tuitionMax : "");
  if (r.tuitionCurrency === "USD" && r.tuitionPeriod === "year") return { text: t + " / year", shown: true, flag: "" };
  return { text: t + " / " + (r.tuitionPeriod || "?"), shown: false, flag: r.tuitionPeriod ? `Price is per ${r.tuitionPeriod}, not per year: not shown` : "Payment period not stated: not shown" };
}
const name = id => MAJORS.find(m => m.id === id).en;
const out = ROWS.map((r, i) => {
  const rm = removal(r), p = price(r), n = r.sheetName, old = r.programNameEn;
  // match the name as written, and the old copy's spelling, so a typo in the sheet doesn't drop a link
  const un = OWNER_UNLINK[r.sheetRow];
  const majors = !n || rm ? [] : LINKS.filter(([, re]) => re.test(n) || (old && re.test(old))).map(([id]) => id).filter(id => !(un && un.majors.includes(id)));
  const flags = un ? [un.why] : [];
  if (!n) flags.push("No program name in the sheet: can't link");
  if (rm) flags.push("REMOVE: " + rm);
  if (n && !rm && !majors.length) flags.push("No matching major among the 16");
  if (majors.length > 1) flags.push("Linked to " + majors.length + " majors: check");
  if (p.flag) flags.push(p.flag);
  if (r.priceChanged) flags.push("Price text in the sheet changed since the old copy: check");
  return { i: i + 1, row: r.sheetRow, uniId: r.universityId, uni: r.universityId.toUpperCase(), prog: n || "(no name)", old, type: r.programType || "", majors, price: p.text, shown: p.shown,
    fee: p.shown ? [r.tuitionMin, r.tuitionMax || r.tuitionMin] : null, flags };
});
// spellings the old copy had corrected; shown as written (owner's rule), listed so they can be fixed in the sheet
const typos = [...new Map(out.filter(o => o.old && o.prog !== "(no name)" && o.old !== o.prog).map(o => [o.row, o])).values()];

const linked = out.filter(o => o.majors.length), removed = out.filter(o => o.flags.some(f => f.startsWith("REMOVE"))),
  noname = out.filter(o => o.prog === "(no name)"), nomatch = out.filter(o => o.flags.includes("No matching major among the 16"));
const khmerOnly = out.filter(o => /[ក-៿]/.test(o.prog) && !/[a-z]/i.test(o.prog));
const perMajor = MAJORS.map(m => { const L = linked.filter(o => o.majors.includes(m.id)); return `| ${m.en} | ${L.length} | ${[...new Set(L.map(o => o.uni))].join(", ") || "—"} | ${L.filter(o => o.shown).length} |`; });
const esc = s => String(s).replace(/\|/g, "\\|");
const md = [
  "# University programs → the 16 majors (PROPOSAL, please approve)", "",
  "Generated by `node tools/propose-university-links.js` from your Google Sheet (saved as `docs/university-sheet.csv` by `node tools/fetch-university-sheet.js`).",
  `Program names are exactly as the sheet has them. Prices, degree types and notes come from the earlier conversion of the same sheet (\`archive/my-version/js/universities.js\`); every row was matched to its sheet row and ${out.filter(o => o.flags.some(f => f.startsWith("Price text"))).length} price texts have changed since. All rows are still “unverified”.`,
  "Nothing is on the site yet. Tell me which links to change, then I'll build `js/universities.js` from the approved table.", "",
  "## Your rules, as I applied them", "",
  "| Rule | What I did | Needs you? |", "|---|---|---|",
  `| Phnom Penh only | All 15 universities are in Phnom Penh (your answer, 30/10/2026): city = ${CITY} on every row. | No |`,
  `| Names as the sheet has them | Shown exactly as written: no translating, no spelling fixes. ${khmerOnly.length} names are in Khmer only (RULE, IU); the English site will show them in Khmer. ${typos.length} names look misspelled (list below). | Only if you want to fix spellings in the sheet. |`,
  `| Bachelor only | ${removed.length} rows marked REMOVE (associate, master's, preparatory/exchange, Norton's non-bachelor nursing/midwifery/lab tech). | Check the REMOVE rows. |`,
  `| Per-year fees | A price is shown only when the sheet says USD **per year** (${out.filter(o => o.shown).length} rows). Per-semester (SETEC), “total” (UC Business Administration) and no-period prices are **not converted**: they show “not confirmed”. | No |`,
  "| IFL price on IFL only | $450–$590 is per year and belongs to IFL itself (your answer, 31/10/2026). It is **not** shown on the 7 RUPP programs listed under IFL. IFL is a heading in the sheet, not a program, so the site has no place to show it yet. | Tell me if IFL should be its own entry. |",
  "| Your single-row decisions | Sheet row 178 (RULE សេដ្ឋកិច្ចព័ត៌មានវិទ្យា): not linked to IT / Software Engineering (your answer, 31/10/2026). | No |",
  noname.length ? `| Removals | ${noname.length} rows have **no program name** in the sheet and can't be linked. | **Yes:** send the names or confirm removal. |`
    : "| Section headings | The sheet's group headings (ITC “Internatioanl Program” and “Associate Degree Programs”, RUPP “IFL”, AUPP “Faculty of Social Science”, NUM “National Program” and “International College”) are not programs, so they are not listed. | No |",
  "", "## Summary per major", "", "| Major | Programs linked | Universities | With a per-year price |", "|---|---|---|---|", ...perMajor, "",
  `**${linked.length}** programs linked · **${nomatch.length}** bachelor programs match none of the 16 majors (e.g. economics, psychology, international relations, sciences) · **${removed.length}** removed${noname.length ? ` · **${noname.length}** without a name` : ""}.`,
  "", `## Names that look misspelled in the sheet (${typos.length})`, "",
  "Shown on the site exactly as in the sheet. If you fix them in the sheet, run `node tools/fetch-university-sheet.js` and the fix flows through.", "",
  "| Sheet row | University | In the sheet | Probably meant |", "|---|---|---|---|",
  ...typos.map(o => `| ${o.row} | ${o.uni} | ${esc(o.prog)} | ${esc(o.old)} |`),
  "", "## Every program", "", "| # | Sheet row | University | Program (as in your sheet) | Proposed major(s) | Price | Notes |", "|---|---|---|---|---|---|---|",
  ...out.map(o => `| ${o.i} | ${o.row} | ${o.uni} | ${esc(o.prog)}${o.type ? ` <small>(${esc(o.type)})</small>` : ""} | ${o.majors.map(name).join(", ") || "—"} | ${o.price}${o.shown ? "" : o.price === "—" ? "" : " *(not shown)*"} | ${esc(o.flags.join("; "))} |`)
];
fs.writeFileSync("docs/university-linking.md", md.join("\n") + "\n");
console.log(`${out.length} rows: ${linked.length} linked, ${nomatch.length} no matching major, ${removed.length} removed, ${noname.length} no name, ${out.filter(o => o.shown).length} with a per-year price`);
console.log(perMajor.join("\n"));

// ---------- --build: write js/universities.js from the approved table (owner approved 31/10/2026) ----------
if (process.argv.includes("--build")) {
  const OUT = "js/universities.js";
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
  // the scholarship list (report section E) and city names are edited by hand: keep them on every rebuild
  const keep = (re, fallback) => (current.match(re) || [fallback])[0];
  const scholarships = keep(/const SCHOLARSHIPS = \[[\s\S]*?\n\];/, "const SCHOLARSHIPS = [];");
  const cities = keep(/const CITIES = \{.*\};/, `const CITIES = {pp:{km:"ភ្នំពេញ",en:"Phnom Penh"}};`);

  // each university's block of sheet rows: from the row after the previous university's last row to its own last row
  const ids = [...new Set(ROWS.map(r => r.universityId))];
  const lastRow = id => Math.max(...ROWS.filter(r => r.universityId === id).map(r => r.sheetRow));
  const unis = ids.map((id, k) => {
    const first = k ? lastRow(ids[k - 1]) + 1 : 3, last = lastRow(id), r0 = ROWS.find(r => r.universityId === id);
    const sch = [...new Set(SHEET.slice(first - 1, last).map(s => clean(s[7])).filter(Boolean))];   // "Scholarship they offer", as written
    const name = r0.universityNameEn;
    const programs = out.filter(o => o.uniId === id && o.majors.length)
      .map(o => ({ name: o.prog + (o.type ? " · " + o.type : ""), majors: o.majors, fee: o.fee }));
    return { id, en: name, km: name, // no Khmer university names yet: the short name is shown in both languages
      short: name.length <= 7 ? name.toUpperCase() : name.replace(/[^A-Z]/g, ""), // badge: "CamTech" → CAMTECH, "Norton University" → NU
      city: "pp", url: r0.officialWebsite || "", sch, lastVerified: r0.lastVerified || null, logo: "", logo_permission: "no", programs };
  }).filter(u => u.programs.length);

  const js = `/* KITE — universities and scholarships.
   GENERATED by \`node tools/propose-university-links.js --build\` from the owner's Google Sheet
   (docs/university-sheet.csv, saved by tools/fetch-university-sheet.js) and the approved docs/university-linking.md.
   Do not edit UNIS by hand: change the sheet, re-run both tools, check the proposal, then --build.
   SCHOLARSHIPS and CITIES below are edited by hand and kept when the file is rebuilt.
   Program names are exactly as in the sheet. fee = [min, max] USD per year, or null when the sheet gives no per-year price.
   All data is still unverified (lastVerified null = "Not checked yet").
   logo: a file name in images/logos/ (e.g. "rupp.png"). It is shown ONLY when logo_permission is "yes"
   (the university has given written permission). Otherwise the report shows a round badge with the initials (short). */
(function(){
const D = window.KITE_DATA = window.KITE_DATA || {};

const UNIS = [
${unis.map(u => "  " + JSON.stringify(u)).join(",\n")}
];
${cities}

${scholarships}

Object.assign(D, {UNIS,CITIES,SCHOLARSHIPS,DATA_CHECKED:null});
})();
`;
  fs.writeFileSync(OUT, js);
  console.log(`\n${OUT} built: ${unis.length} universities, ${unis.reduce((a, u) => a + u.programs.length, 0)} programs`);
}
