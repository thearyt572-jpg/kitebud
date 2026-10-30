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
| 12 | Home, "How it works" step 1 (`index.html`) | ចុះឈ្មោះ | Means "register", but the page also says no registration is needed. Used for "Check-in". |
| 13 | Home, "What we measure" label (`index.html`) | ឥវ៉ាន់របស់អ្នក | "Your luggage": the airport joke may confuse. |
| 14 | Report, "Why it matched" reasons (`js/scoring.js`) | ចំណាប់អារម្មណ៍ខ្លាំងប្រភេទ អ្នកធ្វើ (ធ្វើការដោយដៃ) | Reads stiffly. |
