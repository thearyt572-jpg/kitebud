// majors.js — major profiles
//
// ⚠️ DEMO: fake majors only. Replace with your real major list later.
// "id" is what scoring.js returns; "name" is what the student sees.

const MAJORS = [
  // DEMO majors used by the fake calculateResults()
  { id: "demo-major-1", name: "ជំនាញសាកល្បង ក" },
  { id: "demo-major-2", name: "ជំនាញសាកល្បង ខ" },
  { id: "demo-major-3", name: "ជំនាញសាកល្បង គ" },
  { id: "demo-major-4", name: "ជំនាញសាកល្បង ឃ" },

  // Fictional majors used only by the Free Demo sample results
  { id: "sample-major-1", name: "ជំនាញឧទាហរណ៍ ១" },
  { id: "sample-major-2", name: "ជំនាញឧទាហរណ៍ ២" },
  { id: "sample-major-3", name: "ជំនាញឧទាហរណ៍ ៣" }
];

// Fictional sample results for the Free Demo package.
// These are NOT the student's own results. Same shape as calculateResults() returns.
const SAMPLE_RESULTS = [
  { major: "sample-major-1", percent: 91, breakdown: { job: 88, interest: 95, personality: 86, strength: 93 } },
  { major: "sample-major-2", percent: 78, breakdown: { job: 80, interest: 72, personality: 81, strength: 77 } },
  { major: "sample-major-3", percent: 64, breakdown: { job: 60, interest: 70, personality: 58, strength: 66 } }
];
