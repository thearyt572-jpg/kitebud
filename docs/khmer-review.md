# Task 36 — Khmer wording review

**Rule:** this review must NOT change question text, answer options or answer scales.
Those are locked, validated wording (see `js/questions.js`). Only buttons, menus,
help text and page text may change.

For each line: tick it if it is natural Khmer, or write a better version.

## A. New lines added during the fix plan (not yet reviewed)

| # | Where | Khmer now | Meaning in English | OK / better Khmer |
|---|---|---|---|---|
| 1 | Test → "Retake" confirm box (`assessment.html`) | ចម្លើយ និងលទ្ធផលបច្ចុប្បន្នរបស់អ្នកនឹងត្រូវលុប។ ជំនាញដែលអ្នកបានដោះសោរួច នៅតែបើកនៅលើឧបករណ៍នេះ។ | Your current answers and results will be cleared. Majors you already unlocked stay unlocked on this device. | |
| 2 | FAQ "Can I retake it?" answer (`faq.html`) | បាន ច្រើនដងតាមចិត្ត។ ចុច «ធ្វើតេស្តម្ដងទៀត» នៅលើទំព័រលទ្ធផល។ ការធ្វើម្ដងទៀតនឹងលុបចម្លើយចាស់ ប៉ុន្តែជំនាញដែលអ្នកបានដោះសោរួច នៅតែបើកនៅលើឧបករណ៍នេះ។ | Yes, as many times as you like. Use "Retake test" on your results page. Retaking clears your old answers, but majors you already unlocked stay unlocked on this device. | |
| 3 | Results, under the top 3 (`results.html`) | ជំនាញផ្សេងទៀតដែលអ្នកបានដោះសោពីមុន៖ | Other majors you unlocked before: | |
| 4 | Report, top (`report.html`) | អ្នកបានដោះសោ ២ ក្នុងចំណោមជំនាញកំពូលទាំង ៣។ | You've unlocked 2 of your top 3 majors. | |
| 5 | Report, each university (`report.html`) | ពិនិត្យចុងក្រោយ | Date checked | |
| 6 | Report, each university (`report.html`) | មិនទាន់ពិនិត្យ | Not checked yet | |
| 7 | Report, universities section (`report.html`) | បង្ហាញតែកម្មវិធីថ្នាក់បរិញ្ញាបត្រប៉ុណ្ណោះ។ | Bachelor's degree programs only. | |
| 8 | Report, under the universities (`report.html`) | ព័ត៌មានអាចផ្លាស់ប្ដូរ — សូមពិនិត្យគេហទំព័រផ្លូវការ។ (ទិន្នន័យគំរូសម្រាប់របៀបសាកល្បង) | Info may change — check the official site. (Sample data for test mode.) | |
| 9 | Cookie banner on phones (`js/app.js`) | យើងរក្សាទុកចម្លើយរបស់អ្នកតែលើឧបករណ៍នេះ ដើម្បីឱ្យអ្នកបន្តពេលក្រោយបាន។ បើបដិសេធ ចម្លើយនឹងបាត់ពេលអ្នកបិទផ្ទាំងនេះ។ | We save your answers only on this device so you can continue later. If you decline, they clear when you close this tab. | |
| 10 | Cookie banner on phones (`js/app.js`) | អានបន្ថែម | Read more | |
| 11 | About → "Ideas we build on" (`about.html`) | សំណួរប្រចាំថ្ងៃសាមញ្ញៗ អំពីរបៀបដែលអ្នកចូលចិត្តប្រើថាមពល ទទួលគំនិត សម្រេចចិត្ត និងរៀបចំផែនការ។ ប្រសិនបើអ្នកដឹងប្រភេទបុគ្គលិកលក្ខណៈ ៤ អក្សររបស់អ្នកពីតេស្តផ្សេងរួចហើយ អ្នកអាចវាយបញ្ចូលវាជំនួសវិញ។ | Simple everyday questions about how you like to spend your energy, take in ideas, make decisions and plan. If you already know a 4-letter personality type from another test, you can type it in instead. (English approved.) | |

## B. Lines from the original site that sounded odd in the first review

| # | Where | Khmer now | Problem |
|---|---|---|---|
| 12 | Home, "How it works" step 1 (`index.html`) | ~~ចុះឈ្មោះ~~ → now **ឆែកអ៊ីន** | "ចុះឈ្មោះ" meant "register" (the page also says no registration is needed). Replaced with the loanword for airport check-in. Please confirm. |
| 13 | Home, "What we measure" label (`index.html`) | ឥវ៉ាន់របស់អ្នក | "Your luggage": the airport joke may confuse. |
| 14 | ~~Report, "Why it matched" reasons~~ | ~~ចំណាប់អារម្មណ៍ខ្លាំងប្រភេទ អ្នកធ្វើ (ធ្វើការដោយដៃ)~~ | Removed: replaced by the new reasons in section C. |

## C. New lines added when the test switched to the validated questions (formula 2.1)

Page text only. Every question, answer option and scale on the test page comes from `js/questions.js` (locked).

| # | Where | Khmer now | Meaning in English | OK / better Khmer |
|---|---|---|---|---|
| 15 | Test start screen | ផ្នែក ៤ ប្រហែល ១២ នាទី។ | 4 parts, about 12 minutes. | |
| 16 | Test, optional questions (B2, D2) | ស្រេចចិត្ត — អ្នកអាចរំលងបាន។ | Optional — you can skip this. | |
| 17 | Test, deal-breakers (B3) | ស្រេចចិត្ត — អ្នកអាចទុកទទេបាន។ | Optional — you can leave this empty. | |
| 18 | Test, dream job search | ស្វែងរកការងារ | Search jobs | |
| 19 | Test, dream job search box | ឧ. គិលានុបដ្ឋាក វិស្វករ | e.g. nurse, engineer | |
| 20 | Test, dream job | ជ្រើសវិស័យខាងលើ ឬស្វែងរកការងារ។ | Pick a category above, or search. | |
| 21 | Test, dream job | ប្រើ «…» — វាយដោយខ្លួនឯង | Use “…” — typed by me | |
| 22 | Test, dream job | មិនទាន់មានការងារក្នុងវិស័យនេះ។ | No jobs in this category yet. | |
| 23 | Test, dream job (privacy hint) | កុំវាយឈ្មោះ ឬលេខទូរស័ព្ទរបស់អ្នក។ | Don't type your name or phone number. | |
| 24 | Test, chosen dream job | ការងារក្នុងក្តីស្រមៃរបស់អ្នក · ប្ដូរ | Your dream job · Change | |
| 25 | Test, typed-in dream job | ការងារដែលអ្នកវាយបញ្ចូលខ្លួនឯង ត្រូវបានរក្សាទុក ប៉ុន្តែមានតែការងារក្នុងបញ្ជីប៉ុណ្ណោះ ដែលអាចផ្គូផ្គងជាមួយជំនាញបាន។ | A job you type in is saved, but only jobs from the list can be matched to majors. | |
| 26 | Test, invalid 4-letter type | ធ្វើកម្រងសំណួរខ្លីជំនួសវិញ | Take the short quiz instead | |
| 27 | Report, why it matched (`js/scoring.js`) | ការងារក្នុងក្តីស្រមៃរបស់អ្នក «…» ភ្ជាប់ដោយផ្ទាល់ទៅនឹងជំនាញនេះ។ | Your dream job “…” is directly linked to this major. | |
| 28 | Report, why it matched | អ្នកបានជ្រើសវិស័យ «…» ដែលរួមមានជំនាញនេះ។ | You chose the field “…”, which includes this major. | |
| 29 | Report, why it matched | អ្នកចូលចិត្តសកម្មភាពប្រភេទ «…» ដែលជាប្រភេទចំណាប់អារម្មណ៍សំខាន់របស់ជំនាញនេះ។ | You enjoy “…” activities, this major's main interest type. | |
| 30 | Report, why it matched | និទ្ទេស និងការវាយតម្លៃខ្លួនឯងរបស់អ្នក ខ្លាំងលើជំនាញដែលជំនាញនេះត្រូវការ។ | Your grades and self-ratings are strong in what this major needs. | |
| 31 | Report, why it matched | ទំនោរបុគ្គលិកលក្ខណៈរបស់អ្នកសមនឹងជំនាញនេះ។ | Your personality leanings fit this major. | |
| 32 | Report, deal-breaker note | សម្គាល់៖ អ្នកបានជ្រើស «…» ដែលធ្វើឱ្យពិន្ទុចំណាប់អារម្មណ៍សម្រាប់ជំនាញនេះទាបជាងមុន។ | Note: you ticked “…”, which lowers this major's interest score. | |
| 33 | Report, section C title | ការងារដែលភ្ជាប់នឹងជំនាញនេះ | Jobs linked to this major | |
| 34 | Report, section C note | ពីបញ្ជីការងាររបស់យើង។ ជំនាញមួយមិនធានាការងារណាមួយឡើយ។ | From our career list. A degree does not guarantee any job. | |
| 35 | Report, universities | យើងកំពុងពិនិត្យបញ្ជីសាកលវិទ្យាល័យសម្រាប់ជំនាញនេះនៅឡើយ។ | We're still checking the university list for this major. | |
| 36 | Results, admission note | លក្ខខណ្ឌចូលរៀនខុសគ្នាតាមសាកលវិទ្យាល័យ និងផ្នែកសិក្សា។ សូមពិនិត្យលក្ខខណ្ឌចូលរៀនរបស់សាកលវិទ្យាល័យនីមួយៗ។ | Entry requirements differ by university and track. Check each university's entry requirements. | |
| 37 | Results, future job | អ្នកមិនទាន់បានជ្រើសការងារ ឬវិស័យនៅឡើយ។ | You haven't chosen a job or field yet. | |
| 38 | About, how matching works | ប្រសិនបើផ្នែកណាមួយគ្មានព័ត៌មាន (ឧទាហរណ៍ អ្នកមិនទាន់ដឹងការងារក្នុងក្តីស្រមៃ) ផ្នែកនោះនឹងមិនត្រូវបានរាប់ ជំនួសឱ្យការរាប់ជាសូន្យ។ | If a part has no information (for example, you don't know your dream job yet), that part is left out instead of being counted as zero. | |
| 39 | Home, About, FAQ (test length) | ប្រហែល ១២ នាទី … / អ្នកអាចវាយបញ្ចូលវា ហើយរំលងសំណួរបុគ្គលិកលក្ខណៈទាំង ១២។ | About 12 minutes … / you can type it in and skip the 12 personality questions. | |
| 40 | Privacy, "We keep" | ផ្នែកសិក្សាថ្នាក់ទី ១២ និទ្ទេសជាធម្មតា និងការវាយតម្លៃជំនាញខ្លួនឯង | Your grade 12 track, usual grades and skill self-ratings | |
| 41 | Privacy, "We keep" | ការងារក្នុងក្តីស្រមៃដែលអ្នកជ្រើស ឬវាយបញ្ចូល (សូមកុំវាយឈ្មោះរបស់អ្នក) | A dream job you choose or type in (please don't type your name) | |

## D. Showcase mode (js/config.js SHOWCASE_FREE = true)

| # | Where | Khmer now | Meaning in English | OK / better Khmer |
|---|---|---|---|---|
| 42 | Home price buttons, results button (`js/app.js`) | កំណែបង្ហាញ៖ របាយការណ៍ពេញលេញឥតគិតថ្លៃ | Showcase: full report free | |
| 43 | Home, under the prices (`index.html`) | កំណែបង្ហាញ — ពេលនេះរបាយការណ៍ពេញលេញឥតគិតថ្លៃ។ តម្លៃខាងលើសម្រាប់ពេលក្រោយ។ | Showcase — the full report is free for now. The prices above are for later. | |
| 44 | Checkout title (`checkout.html`) | ការបង់ប្រាក់នឹងមកដល់ឆាប់ៗ | Payment is coming soon | |
| 45 | Checkout text (`checkout.html`) | នៅក្នុងកំណែបង្ហាញនេះ របាយការណ៍ពេញលេញឥតគិតថ្លៃ។ មិនមានការបង់ប្រាក់ទេ។ | In this showcase the full report is free. There is no payment. | |
| 46 | FAQ, type question (`faq.html`) | …សូមជ្រើស «បាទ/ចាស ខ្ញុំដឹងពីបុគ្គលិកលក្ខណៈរបស់ខ្ញុំ» ហើយវាយបញ្ចូល… | …choose “Yes, I know my type” and type it in… (quotes the locked button text) | |
| 47 | Home, pricing intro (`index.html`) | តេស្តគឺឥតគិតថ្លៃជានិច្ច។ បច្ចុប្បន្ននេះ របាយការណ៍ពេញលេញក៏ឥតគិតថ្លៃដែរ។ ការបង់ប្រាក់នឹងមកដល់ពេលក្រោយ។ | The test is always free. For now the full report is free too. Payment will come later. | |
| 48 | Home and FAQ, “Is payment real?” answer (`index.html`, `faq.html`) | មិនទាន់ទេ។ បច្ចុប្បន្ននេះ របាយការណ៍ពេញលេញឥតគិតថ្លៃ។ ការបង់ប្រាក់នឹងមកដល់ពេលក្រោយ។ | Not yet. For now the full report is free. Payment will come later. | |

## E. Interest type names (one set on every page)

Shown on the About page, the results page (“Your profile in plain words”) and the report (“Why it matched”, line 29).
They come from `KITE.INTEREST_NAMES` in `js/scoring.js`. The hidden type names in `js/questions.js` stay locked and are not shown.

| # | Type | Khmer now | English | OK / better Khmer |
|---|---|---|---|---|
| 49 | R | អ្នកធ្វើ | Doer | |
| 50 | I | អ្នកគិត | Thinker | |
| 51 | A | អ្នកបង្កើត | Creator | |
| 52 | S | អ្នកជួយ | Helper | |
| 53 | E | អ្នកដឹកនាំ | Persuader | Khmer means “leader”, not “persuader”. Keep, or suggest better. |
| 54 | C | អ្នករៀបចំ | Organizer | |

## F. University list

| # | Where | Khmer now | Meaning in English | OK / better Khmer |
|---|---|---|---|---|
| 55 | Report, under the university list (`report.html`) | KITE មិនមានទំនាក់ទំនង ឬទទួលបានការគាំទ្រពីសាកលវិទ្យាល័យទាំងនេះទេ។ ព័ត៌មានយកចេញពីគេហទំព័រផ្លូវការរបស់ពួកគេ។ | KITE is not affiliated with or endorsed by these universities. Information comes from their official websites. | |
