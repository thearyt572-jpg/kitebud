// questions.js — question data only
//
// ⚠️ DEMO: these 6 questions are FAKE, only for testing the app.
// In Step 4 you will replace this list with your real questions.
//
// Fields for every question:
//   id       unique name (never change it after launch — saved answers use it)
//   part     which part of the test; questions always stay inside their part
//   type     "rating5" | "single" | "multi" | "pair4" | "grade" | "text-code"
//   text     the question shown to the student (Khmer)
//   options  the answer choices (shape depends on the type, see the examples)
//   key      hidden scoring info — only scoring.js reads it, it is NEVER shown on screen
//
// Optional fields:
//   shuffle    true = can swap places with other shuffle questions in the SAME part
//   min / max  "multi": how many options to pick · "grade": allowed number range
//   step       "grade": e.g. 1 = whole numbers only
//   validation "text-code": { pattern, hint, message }
//   uppercase  "text-code": turn letters into CAPITALS before saving
//   maxLength, placeholder   "text-code": input limits / example text

const QUESTIONS = [

  // DEMO question — type "rating5"
  {
    id: "demo-q1",
    part: 1,
    type: "rating5",
    text: "(សំណួរគំរូ) តើអ្នកចូលចិត្តញ៉ាំការ៉េមកម្រិតណា?",
    options: [
      { value: 1, label: "មិនចូលចិត្តសោះ" },
      { value: 2, label: "មិនសូវចូលចិត្ត" },
      { value: 3, label: "ធម្មតា" },
      { value: 4, label: "ចូលចិត្ត" },
      { value: 5, label: "ចូលចិត្តខ្លាំងណាស់" }
    ],
    key: "DEMO-KEY-1",
    shuffle: true
  },

  // DEMO question — type "single"
  {
    id: "demo-q2",
    part: 1,
    type: "single",
    text: "(សំណួរគំរូ) តើអ្នកចូលចិត្តពណ៌អ្វីជាងគេ?",
    options: [
      { value: "blue", label: "ពណ៌ខៀវ" },
      { value: "pink", label: "ពណ៌ផ្កាឈូក" },
      { value: "yellow", label: "ពណ៌លឿង" },
      { value: "green", label: "ពណ៌បៃតង" }
    ],
    key: "DEMO-KEY-2",
    shuffle: true
  },

  // DEMO question — type "multi" (each option can have its own hidden key)
  {
    id: "demo-q3",
    part: 1,
    type: "multi",
    text: "(សំណួរគំរូ) តើអ្នកចូលចិត្តផ្លែឈើអ្វីខ្លះ? សូមជ្រើសរើសពី ២ ដល់ ៤។",
    options: [
      { value: "mango", label: "ស្វាយ", key: "DEMO-A" },
      { value: "durian", label: "ធុរេន", key: "DEMO-B" },
      { value: "mangosteen", label: "មង្ឃុត", key: "DEMO-C" },
      { value: "rambutan", label: "សាវម៉ាវ", key: "DEMO-A" },
      { value: "banana", label: "ចេក", key: "DEMO-B" },
      { value: "papaya", label: "ល្ហុង", key: "DEMO-C" }
    ],
    min: 2,
    max: 4,
    key: "DEMO-KEY-3"
  },

  // DEMO question — type "pair4" (options has side a and side b)
  {
    id: "demo-q4",
    part: 2,
    type: "pair4",
    text: "(សំណួរគំរូ) ពេលវិស្សមកាល តើអ្នកចូលចិត្តមួយណាជាង?",
    options: {
      a: "ទៅលេងសមុទ្រ",
      b: "ទៅលេងភ្នំ"
    },
    key: "DEMO-KEY-4",
    shuffle: true
  },

  // DEMO question — type "grade"
  {
    id: "demo-q5",
    part: 2,
    type: "grade",
    text: "(សំណួរគំរូ) សូមបញ្ចូលលេខណាមួយពី 0 ដល់ 100។",
    options: null,
    min: 0,
    max: 100,
    step: 1,
    key: "DEMO-KEY-5",
    shuffle: true
  },

  // DEMO question — type "text-code"
  {
    id: "demo-q6",
    part: 2,
    type: "text-code",
    text: "(សំណួរគំរូ) សូមវាយលេខកូដគំរូ ដែលមានអក្សរឡាតាំង ៤ តួ (ឧទាហរណ៍៖ ABCD)។",
    options: null,
    validation: {
      pattern: "^[A-Z]{4}$",
      hint: "អក្សរឡាតាំង A–Z ចំនួន ៤ តួ",
      message: "លេខកូដត្រូវមានអក្សរឡាតាំង A–Z ចំនួន ៤ តួ។"
    },
    uppercase: true,
    maxLength: 4,
    placeholder: "ABCD",
    key: "DEMO-KEY-6"
  }

];
