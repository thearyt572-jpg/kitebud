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
| 8 | Report, under the universities (`report.html`) | ព័ត៌មានអាចផ្លាស់ប្ដូរ — សូមពិនិត្យគេហទំព័រផ្លូវការ។ | Info may change — check the official site. (The “sample data” part was removed when the real university data went in.) | |
| 9 | ~~Cookie banner on phones~~ (replaced, see section H) | យើងរក្សាទុកចម្លើយរបស់អ្នកតែលើឧបករណ៍នេះ ដើម្បីឱ្យអ្នកបន្តពេលក្រោយបាន។ បើបដិសេធ ចម្លើយនឹងបាត់ពេលអ្នកបិទផ្ទាំងនេះ។ | We save your answers only on this device so you can continue later. If you decline, they clear when you close this tab. | |
| 10 | ~~Cookie banner on phones~~ (replaced, see section H) | អានបន្ថែម | Read more | |
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
| 56 | Report, each university (`report.html`) | កម្មវិធីសិក្សា | Programs | |
| 57 | Report, each university, when the sheet gives no per-year price (`report.html`) | មិនទាន់បញ្ជាក់ | Not confirmed yet | |

## G. Feedback on the results page (shown only after Allow)

| # | Where | Khmer now | Meaning in English | OK / better Khmer |
|---|---|---|---|---|
| 58 | Results, feedback question (`results.html`) | តើលទ្ធផលនេះត្រូវនឹងអ្នកកម្រិតណា? | How well does this match you? | |
| 59 | Results, under the 1–5 buttons | ១ = មិនត្រូវសោះ · ៥ = ត្រូវខ្លាំងណាស់ | 1 = not at all · 5 = very well | |
| 60 | Results, comment box label | មតិ (ស្រេចចិត្ត) | Comment (optional) | |
| 61 | Results, send button | ផ្ញើ | Send | |
| 62 | Results, after sending | អរគុណសម្រាប់មតិរបស់អ្នក! | Thank you for your feedback! | |

(The privacy hint under the comment box reuses row 23: កុំវាយឈ្មោះ ឬលេខទូរស័ព្ទរបស់អ្នក។)

## H. Privacy notice and cookie banner (owner's English approved 31/10/2026; Khmer is a DRAFT)

Every Khmer line below is a first draft written from the approved English. **[NEEDS NATIVE CHECK]** on each line: please correct the Khmer here, and I'll copy your version into the site. The rows for the old banner (9, 10) are replaced by these.

| # | Where | Khmer now [NEEDS NATIVE CHECK] | English (approved) | OK / better Khmer |
|---|---|---|---|---|
| 63 | Privacy page | [NEEDS NATIVE CHECK] សេចក្តីជូនដំណឹងអំពីឯកជនភាព | Privacy notice | |
| 64 | Privacy page | [NEEDS NATIVE CHECK] សេចក្តីជូនដំណឹងអំពីឯកជនភាពរបស់ KITEBud | KITEBud Privacy Notice | |
| 65 | Privacy page | [NEEDS NATIVE CHECK] KITEBud គោរពឯកជនភាពរបស់អ្នក។ យើងប្រមូលតែព័ត៌មានដែលចាំបាច់ ដើម្បីដំណើរការតេស្តផ្គូផ្គងជំនាញ និងដើម្បីសិក្សាថាតេស្តនេះមានប្រយោជន៍កម្រិតណា។ | KITEBud respects your privacy. We collect only the information needed to run the major-matching test and to study how useful it is. | |
| 66 | Privacy page | [NEEDS NATIVE CHECK] តើយើងប្រមូលព័ត៌មានអ្វីខ្លះ? | What information do we collect? | |
| 67 | Privacy page | [NEEDS NATIVE CHECK] បើអ្នកជ្រើស «អនុញ្ញាត» យើងរក្សាទុក៖ | If you choose Allow, we save: | |
| 68 | Privacy page | [NEEDS NATIVE CHECK] លេខសម្គាល់អ្នកទស្សនាអនាមិក ដែលក៏ត្រូវបានរក្សាទុកក្នុងខូគីឈ្មោះ kite_vid | An anonymous visitor ID, also kept in a cookie called kite_vid. | |
| 69 | Privacy page | [NEEDS NATIVE CHECK] ជម្រើសខូគីរបស់អ្នក។ | Your cookie choice. | |
| 70 | Privacy page | [NEEDS NATIVE CHECK] ចម្លើយកម្រងសំណួររបស់អ្នក ម្តងមួយផ្នែក រួមទាំងការងារក្នុងក្តីស្រមៃដែលអ្នកវាយបញ្ចូលខ្លួនឯង។ | Your questionnaire answers, one part at a time, including a dream job you type in yourself. | |
| 71 | Privacy page | [NEEDS NATIVE CHECK] លទ្ធផលផ្គូផ្គងរបស់អ្នក កំណែនៃរូបមន្តផ្គូផ្គង និងរយៈពេលដែលអ្នកប្រើក្នុងការធ្វើតេស្ត។ | Your matching results, the version of the matching formula, and how long the test took you. | |
| 72 | Privacy page | [NEEDS NATIVE CHECK] ការវាយតម្លៃពី ១ ដល់ ៥ និងមតិរបស់អ្នក ប្រសិនបើអ្នកជ្រើសផ្ញើមតិ។ | Your 1–5 rating and comment, if you choose to send feedback. | |
| 73 | Privacy page | [NEEDS NATIVE CHECK] កាលបរិច្ឆេទ និងម៉ោងដែលកំណត់ត្រានីមួយៗត្រូវបានរក្សាទុក។ វាត្រូវបានបន្ថែមដោយស្វ័យប្រវត្តិ ដើម្បីឱ្យយើងដឹងថាទិន្នន័យសិក្សាត្រូវបានប្រមូលនៅពេលណា។ វាមិនប្រាប់យើងថាអ្នកជានរណាទេ។ | The date and time each record was saved. This is added automatically, so we know when the study data was collected. It does not tell us who you are. | |
| 74 | Privacy page | [NEEDS NATIVE CHECK] ភាសារបស់អ្នក (ខ្មែរ ឬអង់គ្លេស)។ | Your language (Khmer or English). | |
| 75 | Privacy page | [NEEDS NATIVE CHECK] ប្រភេទឧបករណ៍របស់អ្នក៖ ទូរស័ព្ទ ថេប្លេត ឬកុំព្យូទ័រ។ | Your device type: phone, tablet or computer. | |
| 76 | Privacy page | [NEEDS NATIVE CHECK] យើងមិនសួររកឈ្មោះ លេខទូរស័ព្ទ ឈ្មោះសាលា ឬទីតាំងច្បាស់លាស់របស់អ្នកទេ។ សូមកុំវាយព័ត៌មានទាំងនេះក្នុងប្រអប់ការងារក្នុងក្តីស្រមៃ ឬក្នុងមតិរបស់អ្នក។ | We do not ask for your name, phone number, school name, or precise location. Please don't type them in the dream job box or in your comment. | |
| 77 | Privacy page | [NEEDS NATIVE CHECK] ហេតុអ្វីបានជាយើងប្រមូលព័ត៌មាននេះ? | Why do we collect this information? | |
| 78 | Privacy page | [NEEDS NATIVE CHECK] យើងប្រើព័ត៌មាននេះដើម្បី៖ | We use the information to: | |
| 79 | Privacy page | [NEEDS NATIVE CHECK] កែលម្អកម្រងសំណួរ និងការផ្គូផ្គង។ | Improve the questionnaire and the matching. | |
| 80 | Privacy page | [NEEDS NATIVE CHECK] ធ្វើការសិក្សាផ្ទៀងផ្ទាត់ ថា KITEBud មានប្រយោជន៍កម្រិតណា។ | Run a validation study of how useful KITEBud is. | |
| 81 | Privacy page | [NEEDS NATIVE CHECK] លទ្ធផលរបស់អ្នកត្រូវបានគណនានៅលើឧបករណ៍របស់អ្នកផ្ទាល់។ វាមិនមែនជាការសម្រេចចូលរៀននៅសាកលវិទ្យាល័យ ឬការវាយតម្លៃផ្លូវចិត្តដោយអ្នកជំនាញទេ។ | Your results are calculated on your own device. They are not university admission decisions or professional psychological assessments. | |
| 82 | Privacy page | [NEEDS NATIVE CHECK] តើនរណាអាចមើលឃើញ? | Who can see it? | |
| 83 | Privacy page | [NEEDS NATIVE CHECK] មានតែក្រុមការងារ KITEBud ប៉ុណ្ណោះ។ ចម្លើយរបស់អ្នកត្រូវបានរក្សាទុកនៅក្រុមហ៊ុនផ្តល់សេវាមូលដ្ឋានទិន្នន័យរបស់យើង។ គេហទំព័រអាចបន្ថែមចម្លើយបាន ប៉ុន្តែមិនអាចអានវាត្រឡប់មកវិញបានទេ។ | Only the KITEBud team. Your answers are stored with our database provider. The website can add answers but cannot read them back. | |
| 84 | Privacy page | [NEEDS NATIVE CHECK] នៅលើឧបករណ៍របស់អ្នក | On your device | |
| 85 | Privacy page | [NEEDS NATIVE CHECK] កម្មវិធីរុករករបស់អ្នករក្សាទុកចម្លើយ និងលទ្ធផលរបស់អ្នកនៅលើឧបករណ៍នេះ ដើម្បីឱ្យអ្នកអាចបន្តពេលក្រោយ។ ប្រសិនបើអ្នកជ្រើស «បដិសេធ» វានឹងបាត់ពេលអ្នកបិទផ្ទាំង។ | Your browser keeps your answers and results on this device so you can continue later. If you choose Decline, they disappear when you close the tab. | |
| 86 | Privacy page | [NEEDS NATIVE CHECK] កំណត់ត្រាបច្ចេកទេស | Technical logs | |
| 87 | Privacy page | [NEEDS NATIVE CHECK] យើងមិនប្រើកម្មវិធីតាមដានសម្រាប់វិភាគ ឬផ្សាយពាណិជ្ជកម្មទេ។ សេវាដែលដំណើរការ KITEBud រក្សាទុកកំណត់ត្រាបច្ចេកទេសខ្លីៗដោយស្វ័យប្រវត្តិ ដូចជាអាសយដ្ឋានអ៊ីនធឺណិត (IP) និងប្រភេទកម្មវិធីរុករករបស់អ្នក ដើម្បីរក្សាសេវាឱ្យមានសុវត្ថិភាព និងដំណើរការបានល្អ៖ | We do not use analytics or advertising trackers. The services that run KITEBud automatically keep short technical logs, such as your internet (IP) address and browser type, to keep the service safe and working: | |
| 88 | Privacy page | [NEEDS NATIVE CHECK] ក្រុមហ៊ុនផ្តល់សេវាមូលដ្ឋានទិន្នន័យរបស់យើង៖ រហូតដល់ ៧ ថ្ងៃ។ | our database provider: up to 7 days; | |
| 89 | Privacy page | [NEEDS NATIVE CHECK] ក្រុមហ៊ុនបង្ហោះគេហទំព័ររបស់យើង៖ រហូតដល់ ៣០ ថ្ងៃ។ | our website host: up to 30 days; | |
| 90 | Privacy page | [NEEDS NATIVE CHECK] សេវាដែលផ្ញើឯកសារកូដមួយរបស់យើង បន្ទាប់ពីអ្នកចុច «អនុញ្ញាត» (jsDelivr)។ | the service that delivers one of our code files after you press Allow (jsDelivr). | |
| 91 | Privacy page | [NEEDS NATIVE CHECK] តើយើងរក្សាទុកព័ត៌មានរបស់អ្នករយៈពេលប៉ុន្មាន? | How long do we keep your information? | |
| 92 | Privacy page | [NEEDS NATIVE CHECK] យើងរក្សាទុកកំណត់ត្រានៃការសាកល្បងរហូតដល់ ១២ ខែ បន្ទាប់ពីការសិក្សាបញ្ចប់។ បន្ទាប់មក យើងលុបវាចោល ឬធ្វើឱ្យវាក្លាយជាអនាមិក សម្រាប់របាយការណ៍ស្រាវជ្រាវ។ | We keep pilot records for up to 12 months after the study ends. After that, we delete them or make them anonymous for research reporting. | |
| 93 | Privacy page | [NEEDS NATIVE CHECK] ខូគី និងជម្រើសរបស់អ្នក | Cookies and your choice | |
| 94 | Privacy page | [NEEDS NATIVE CHECK] អ្នកអាចជ្រើស «អនុញ្ញាត» ឬ «បដិសេធ»។ | You can choose Allow or Decline. | |
| 95 | Privacy page | [NEEDS NATIVE CHECK] អនុញ្ញាត៖ KITEBud បង្កើតខូគីលេខសម្គាល់អ្នកទស្សនាអនាមិកមួយ ដែលមានសុពលភាព ១៨០ ថ្ងៃ។ | Allow: KITEBud creates an anonymous visitor ID cookie that lasts 180 days. | |
| 96 | Privacy page | [NEEDS NATIVE CHECK] បដិសេធ៖ តេស្តរបស់អ្នកនៅតែដំណើរការ ប៉ុន្តែចម្លើយ និងលេខសម្គាល់អ្នកទស្សនារបស់អ្នក មិនត្រូវបានរក្សាទុកក្នុងមូលដ្ឋានទិន្នន័យរបស់យើងទេ។ | Decline: your test still works, but your answers and visitor ID are not saved to our database. | |
| 97 | Privacy page | [NEEDS NATIVE CHECK] អ្នកអាចប្តូរជម្រើសរបស់អ្នកបានគ្រប់ពេល តាមរយៈ «ការកំណត់ខូគី» នៅខាងក្រោមនៃទំព័រនីមួយៗ។ ប្រសិនបើអ្នកប្តូរទៅ «បដិសេធ» គ្មានអ្វីថ្មីត្រូវបានរក្សាទុកទេ។ កំណត់ត្រាដែលយើងបានរក្សាទុករួចហើយ នៅតែមាន រហូតដល់អ្នកស្នើឱ្យយើងលុបវា។ | You can change your choice any time with Cookie settings at the bottom of every page. If you switch to Decline, nothing new is saved. Records we already saved stay until you ask us to delete them. | |
| 98 | Privacy page | [NEEDS NATIVE CHECK] តើអ្នកអាចស្នើសុំលុបបានទេ? | Can you request deletion? | |
| 99 | Privacy page | [NEEDS NATIVE CHECK] បាន។ | Yes. | |
| 100 | Privacy page | [NEEDS NATIVE CHECK] នៅលើឧបករណ៍នេះ៖ ចុច «លុបទិន្នន័យរបស់ខ្ញុំនៅលើឧបករណ៍នេះ» ខាងក្រោម។ វានឹងលុបចម្លើយ លទ្ធផល លេខសម្គាល់អ្នកទស្សនា និងខូគី ចេញពីឧបករណ៍នេះ។ | On this device: press “Delete my data on this device” below. It removes your answers, results, visitor ID and the cookie from this device. | |
| 101 | Privacy page | [NEEDS NATIVE CHECK] ពីមូលដ្ឋានទិន្នន័យរបស់យើង៖ ផ្ញើលេខសម្គាល់អ្នកទស្សនារបស់អ្នកមកយើង (បង្ហាញនៅខាងក្រោមទំព័រលទ្ធផល និងនៅលើទំព័រនេះ)។ យើងនឹងលុបកំណត់ត្រាទាំងអស់ដែលភ្ជាប់នឹងលេខនោះ។ | From our database: send us your visitor ID (shown at the bottom of your results page and on this page). We will delete all records linked to it. | |
| 102 | Privacy page | [NEEDS NATIVE CHECK] ទំនាក់ទំនង | Contact | |
| 103 | Privacy page | [NEEDS NATIVE CHECK] សម្រាប់សំណួរអំពីឯកជនភាព ឬការស្នើសុំលុប សូមទាក់ទង៖ | For privacy questions or deletion requests, contact: | |
| 104 | Privacy page | [NEEDS NATIVE CHECK] សម្រាប់ឪពុកម្តាយ និងអាណាព្យាបាល | For parents and guardians | |
| 105 | Privacy page | [NEEDS NATIVE CHECK] KITEBud ត្រូវបានរចនាឡើងដើម្បីជួយសិស្សស្វែងយល់ពីជម្រើសការសិក្សានាពេលអនាគត។ យើងមិនដែលសួររកឈ្មោះ ឬព័ត៌មានទំនាក់ទំនងទេ ហើយក៏គ្មានគណនីដែរ។ យើងលើកទឹកចិត្តឱ្យឪពុកម្តាយ ឬអាណាព្យាបាល ពិនិត្យមើលសេចក្តីជូនដំណឹងនេះជាមួយសិស្សដែលមានអាយុក្រោម ១៨ ឆ្នាំ មុនពេលពួកគេចូលរួមក្នុងការសាកល្បងស្រាវជ្រាវ។ | KITEBud is designed to help students explore their future study options. We never ask for names or contact details, and there is no account. We encourage parents or guardians to review this notice with students under 18 before they take part in the research pilot. | |
| 106 | Cookie banner, heading | [NEEDS NATIVE CHECK] យើងគោរពឯកជនភាពរបស់អ្នក។ | We respect your privacy. | |
| 107 | Cookie banner, text | [NEEDS NATIVE CHECK] បើអ្នកជ្រើស «អនុញ្ញាត» KITEBud នឹងបង្កើតខូគីអនាមិកមួយ ដែលមានលេខសម្គាល់អ្នកទស្សនារបស់អ្នក ហើយរក្សាទុកចម្លើយ និងលទ្ធផលតេស្តរបស់អ្នក សម្រាប់ការសិក្សារបស់យើង។ អ្នកអាចបដិសេធ ហើយនៅតែប្រើតេស្តបាន៖ គ្មានលេខសម្គាល់អ្នកទស្សនា ឬទិន្នន័យកម្រងសំណួរណាមួយ ត្រូវបានរក្សាទុកក្នុងមូលដ្ឋានទិន្នន័យរបស់យើងទេ។ | If you choose Allow, KITEBud creates an anonymous cookie with your visitor ID and saves your test answers and results for our study. You can decline and still use the test: no visitor ID or questionnaire data will be saved to our database. | |
| 108 | Cookie banner, link | [NEEDS NATIVE CHECK] អានសេចក្តីជូនដំណឹងអំពីឯកជនភាព | Read the privacy notice | |
| 109 | Toast after Allow | [NEEDS NATIVE CHECK] ចម្លើយរបស់អ្នកនឹងត្រូវរក្សាទុកសម្រាប់ការសិក្សា | Your answers will be saved for the study | |
