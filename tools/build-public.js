// Builds the public/ folder: the ONLY files that go online (the 8 pages, css/, js/, fonts/, favicon).
// archive/, docs/, tools/ and tests/ are never copied. Netlify runs this on every deploy (netlify.toml).
// Run by hand: node tools/build-public.js   (then drag public/ to Netlify, or let Netlify build it)
const fs = require("fs"), path = require("path");
const OUT = "public";
const PAGES = ["index.html", "assessment.html", "results.html", "report.html", "checkout.html", "faq.html", "privacy.html", "about.html"];
const FILES = [...PAGES, "favicon.svg"];
const FOLDERS = ["css", "js", "fonts"];

fs.rmSync(OUT, { recursive: true, force: true });     // start clean so nothing old stays online
fs.mkdirSync(OUT);
for (const f of FILES) fs.copyFileSync(f, path.join(OUT, f));
for (const d of FOLDERS) fs.cpSync(d, path.join(OUT, d), { recursive: true });

// safety check: list everything in public/ and stop if anything private got in
const all = [];
(function walk(dir) { for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, e.name); e.isDirectory() ? walk(p) : all.push(p.replace(/\\/g, "/")); } })(OUT);
const bad = all.filter(p => /\/(archive|docs|tools|tests|\.git)\//.test(p) || /\.(md|csv)$/.test(p));
if (bad.length) { console.error("Private files found in public/:", bad); process.exit(1); }
console.log(`public/ ready: ${all.length} files (${PAGES.length} pages, ${FOLDERS.join(", ")}, favicon)`);
