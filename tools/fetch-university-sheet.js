// Downloads the owner's university Google Sheet (tab gid=0) as CSV into docs/university-sheet.csv.
// The sheet is the source for university program names; docs/ is never published.
// The sheet must stay "anyone with the link can view". Run: node tools/fetch-university-sheet.js
const fs = require("fs");
const SHEET = "1dNnZ-Nta2PBy_5F4i31NjXoG6zywielNjLPythaSmaM";
const OUT = "docs/university-sheet.csv";
(async () => {
  const res = await fetch(`https://docs.google.com/spreadsheets/d/${SHEET}/export?format=csv&gid=0`);
  const text = await res.text();
  if (!res.ok || !/text\/csv/.test(res.headers.get("content-type") || "")) {
    console.error(`Could not download the sheet (HTTP ${res.status}). Is it still shared as "anyone with the link can view"?`);
    process.exit(1);
  }
  fs.writeFileSync(OUT, text);
  console.log(`${OUT} saved (${text.length} characters, ${new Date().toISOString().slice(0, 10)}). Now run: node tools/propose-university-links.js`);
})();
