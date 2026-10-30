// scoring.js — scoring formula only
//
// ⚠️ DEMO: calculateResults() returns FAKE numbers.
// In Step 4 you will replace the INSIDE of this function with your real formula.
//
// Input — answers: an object, question id → the student's answer, for example
//   {
//     "demo-q1": 4,                      // rating5 → number 1–5
//     "demo-q2": "pink",                 // single  → option value
//     "demo-q3": ["mango", "durian"],    // multi   → array of option values
//     "demo-q4": "B1",                   // pair4   → "A2" | "A1" | "B1" | "B2"
//                                        //           (Definitely A / Probably A / Probably B / Definitely B)
//     "demo-q5": 75,                     // grade   → number
//     "demo-q6": "ABCD"                  // text-code → text
//   }
//   To read a question's hidden key:  QUESTIONS.find(q => q.id === "demo-q1").key
//
// Output: an array of objects like
//   { major: "demo-major-1", percent: 87,
//     breakdown: { job: 90, interest: 85, personality: 80, strength: 92 } }
//   "major" must match an id in MAJORS (majors.js).
//   You may return more than 3 — the app sorts by percent and shows the top 3.

function calculateResults(answers) {
  // DEMO: fixed fake numbers. They do NOT depend on the answers.
  return [
    { major: "demo-major-1", percent: 87, breakdown: { job: 90, interest: 85, personality: 80, strength: 92 } },
    { major: "demo-major-2", percent: 74, breakdown: { job: 70, interest: 78, personality: 75, strength: 72 } },
    { major: "demo-major-3", percent: 66, breakdown: { job: 62, interest: 70, personality: 68, strength: 63 } },
    { major: "demo-major-4", percent: 41, breakdown: { job: 45, interest: 38, personality: 40, strength: 42 } }
  ];
}
