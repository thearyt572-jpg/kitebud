# University names: review before adding Khmer names

Prepared 2026-11-04 (redesign Phase 6). **Nothing on the site has changed yet.** No name below may be used until the owner confirms it.

## What the site shows today

- All 15 universities show the **short name from the owner's sheet** (column "University name"), the same in Khmer and English mode. The generator sets `km` to the English short name (`tools/propose-university-links.js`, "no Khmer university names yet").
- The sheet (`docs/university-sheet.csv`) has **no Khmer names and no full English names**.
- `js/universities.js` is generated. Approved names must go in through the generator, never by editing that file.

## The 6 names in the old sample file

The old sample data (git `0fe4ffb^:js/universities.js`) had full English and Khmer names for 6 of today's 15. They were typed in for the sample and **never checked**, so they are listed below as *candidates only, unverified*.

## Review table

Status key: **Needs review** = a candidate exists but nobody has confirmed it · **Missing** = no candidate at all; please provide one · **Confirmed** = checked against an official source (none yet).

| # | ID | Shown now (both languages) | Full English name (candidate) | Khmer name (candidate) | Status | Official source / evidence | Where to confirm |
|---|---|---|---|---|---|---|---|
| 1 | itc | ITC | Institute of Technology of Cambodia *(old sample, unverified)* | វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា *(old sample, unverified)* | Needs review | none yet | https://itc.edu.kh/ |
| 2 | rupp | RUPP | Royal University of Phnom Penh *(old sample, unverified)* | សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ *(old sample, unverified)* | Needs review | none yet | https://www.rupp.edu.kh/ |
| 3 | cadt | CADT | Cambodia Academy of Digital Technology *(old sample, unverified)* | បណ្ឌិត្យសភាបច្ចេកវិទ្យាឌីជីថលកម្ពុជា *(old sample, unverified)* | Needs review | none yet | https://cadt.edu.kh/ |
| 4 | aupp | AUPP | American University of Phnom Penh *(old sample, unverified)* | សាកលវិទ្យាល័យអាមេរិកាំងភ្នំពេញ *(old sample, unverified)* | Needs review | none yet | https://www.aupp.edu.kh/ |
| 5 | paragon | Paragon | — | — | Missing | none | https://www.paragoniu.edu.kh/ |
| 6 | ute | UTE | — | — | Missing | none | https://ute.edu.kh/ |
| 7 | beltei | BELTEI *(sheet spells it "Beltie")* | — | — | Missing | none | https://www.beltei.edu.kh/ |
| 8 | rule | RULE | Royal University of Law and Economics *(old sample, unverified)* | សាកលវិទ្យាល័យភូមិន្ទនីតិសាស្ត្រ និងវិទ្យាសាស្ត្រសេដ្ឋកិច្ច *(old sample, unverified)* | Needs review | none yet | https://rule.edu.kh/ |
| 9 | camtech | CamTech | — | — | Missing | none | https://camtech.edu.kh/ |
| 10 | camed | CamEd | — | — | Missing | none | https://cam-ed.edu.kh/ |
| 11 | uc | UC | — | — | Missing | none | https://uc.edu.kh/kh/ |
| 12 | setech | SeTech Institute | — | — | Missing | none | https://www.setecu.com/ |
| 13 | norton | Norton University | Norton University *(the sheet's name; full form not checked)* | — | Missing | none | no website in the sheet |
| 14 | num | NUM | National University of Management *(old sample, unverified)* | សាកលវិទ្យាល័យជាតិគ្រប់គ្រង *(old sample, unverified)* | Needs review | none yet | https://numuniversity.com/ |
| 15 | iu | IU | — | — | Missing | none | https://www.iu.edu.kh/ |

**Summary:** 0 confirmed · 6 need review (old sample candidates) · 9 missing.

## What the owner needs to do

For each university, either confirm the candidate names or write the official ones, e.g.:

> rupp: OK · cadt: Khmer should be "…" · paragon: English "…", Khmer "…" · norton: leave as is

You can also leave any university as it is today (short name in both languages).

## How approved names will be added (later, after approval)

1. Record the approved names in one source the generator reads (a small table in this file or new sheet columns; the choice is the owner's).
2. Update `tools/propose-university-links.js` to read them instead of copying the short name into `km`.
3. Run `node tools/propose-university-links.js --build`, then the usual checks. Do not edit `js/universities.js` by hand.
