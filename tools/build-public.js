// Builds the public/ folder: the ONLY files that go online (the 8 pages, css/, js/, fonts/, images/ if any, favicon).
// archive/, docs/, tools/ and tests/ are never copied. Netlify runs this on every deploy (netlify.toml).
// We deploy ONLY through Netlify from GitHub, never by uploading public/ by hand.
// To test locally: node tools/build-public.js
const fs = require("fs"), path = require("path");
const OUT = "public";
const PAGES = ["index.html", "assessment.html", "results.html", "report.html", "checkout.html", "faq.html", "privacy.html", "about.html"];
const FILES = [...PAGES, "favicon.svg"];
const FOLDERS = ["css", "js", "fonts", "images"].filter(d => d !== "images" || fs.existsSync(d)); // images/logos/ once we have permitted logos
const fail = msg => { console.error("\nBUILD FAILED: " + msg + "\n"); process.exit(1); };

// js/config.js decides showcase mode. Without it every page silently falls back to paid mode, so stop here.
const CONFIG = "js/config.js";
if (!fs.existsSync(CONFIG)) fail(`${CONFIG} is missing. Without it showcase mode switches off and the prices and test checkout come back.`);
const showcase = (fs.readFileSync(CONFIG, "utf8").match(/SHOWCASE_FREE\s*:\s*(true|false)/) || [])[1];
if (!showcase) fail(`${CONFIG} does not set SHOWCASE_FREE to true or false.`);

fs.rmSync(OUT, { recursive: true, force: true });     // start clean so nothing old stays online
fs.mkdirSync(OUT);
for (const f of FILES) fs.copyFileSync(f, path.join(OUT, f));
for (const d of FOLDERS) fs.cpSync(d, path.join(OUT, d), { recursive: true });

// safety check: list everything in public/ and stop if anything private got in
const all = [];
(function walk(dir) { for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, e.name); e.isDirectory() ? walk(p) : all.push(p.replace(/\\/g, "/")); } })(OUT);
const bad = all.filter(p => /\/(archive|docs|tools|tests|\.git)\//.test(p) || /\.(md|csv)$/.test(p));
if (bad.length) fail("private files found in public/: " + bad.join(", "));

// every script and stylesheet a page loads must be in public/ (a missing file means a broken page online)
const missing = [];
for (const p of PAGES) for (const [, src] of fs.readFileSync(p, "utf8").matchAll(/<(?:script|link)[^>]+(?:src|href)="([^"#?:]+\.(?:js|css))"/g))
  if (!fs.existsSync(path.join(OUT, src))) missing.push(`${p} → ${src}`);
if (missing.length) fail("pages load files that are not in public/: " + missing.join(", "));

console.log(`public/ ready: ${all.length} files (${PAGES.length} pages, ${FOLDERS.join(", ")}, favicon) · showcase mode ${showcase === "true" ? "ON (full report free, no payment)" : "OFF"}`);
