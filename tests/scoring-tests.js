/* KITE — checks for formula 1.0 (docs/question-design.md sections 10–15). Runs in tests/scoring-tests.html
   and in Node (node tools/test-scoring.js). Each check: [what it checks, actual value, expected value, tolerance]. */
window.KITE_TESTS = function(){
  const K = window.KITE, D = window.KITE_DATA, F = K._formula, P = id => D.MAJOR_PROFILES[id];
  const job = en => D.Q.A.jobs.find(j=>j.en===en).id;
  const b1 = (vals) => { const o = {}; D.Q.B1.items.forEach(x=>o[x.id]=vals[x.type]); return o; }; // same rating for all items of a type
  const quiz = idx => Object.fromEntries(D.Q.C.quiz.map((x,i)=>[x.id, idx[i]]));
  const T = F.riasec({b1:b1({R:1,I:5,A:3,S:3,E:3,C:3})});
  const r1 = v => Math.round(v*10)/10;
  return [
    // ---- the owner's worked examples ----
    ["Worked example: Data Science personality fit (Social 33, Big-picture 78, Planner 67)", r1(F.persFit({social:33,big_picture:78,heart_first:50,planner:67}, P("ds"))), 93.7, 0],
    ["Worked example: Overall = 0.25×60 + 0.30×83.7 + 0.20×93.7 + 0.25×87.3", Math.round(K.combine({job:60,interest:83.7,pers:93.7,strength:87.3})), 81, 0],
    // ---- overall + missing evidence (section 14) ----
    ["Weights are 25 / 30 / 20 / 25", JSON.stringify(K.WEIGHTS), JSON.stringify({job:.25,interest:.30,pers:.20,strength:.25})],
    ["Job missing → (0.30I + 0.20P + 0.25S) ÷ 0.75", K.combine({job:null,interest:80,pers:60,strength:40}), (0.30*80+0.20*60+0.25*40)/0.75, 1e-9],
    ["Strength missing → (0.25J + 0.30I + 0.20P) ÷ 0.75", K.combine({job:100,interest:80,pers:60,strength:null}), (0.25*100+0.30*80+0.20*60)/0.75, 1e-9],
    ["Job and Strength missing → (0.30I + 0.20P) ÷ 0.50", K.combine({job:null,interest:80,pers:60,strength:null}), (0.30*80+0.20*60)/0.50, 1e-9],
    ["Nothing usable → null (shown as “Not enough info”)", K.combine({job:null,interest:null,pers:null,strength:null}), null],
    ["Formula version is 1.0", K.FORMULA_VERSION, "1.0"],
    // ---- Job Fit (section 2 + mappings) ----
    ["Data analyst → Data Science 100 (direct)", F.jobFit({a:{mode:"job",job:job("Data analyst")}},"ds"), 100],
    ["Data analyst → IT / Software Eng. 100 (direct)", F.jobFit({a:{mode:"job",job:job("Data analyst")}},"it"), 100],
    ["Data analyst → Cybersecurity 50 (same Technology field)", F.jobFit({a:{mode:"job",job:job("Data analyst")}},"cy"), 50],
    ["Data analyst → Civil Engineering 0 (other field)", F.jobFit({a:{mode:"job",job:job("Data analyst")}},"ce"), 0],
    ["Mechanical engineer (legacy id me) → Civil Engineering 50, not 100", F.jobFit({a:{mode:"job",job:job("Mechanical engineer")}},"ce"), 50],
    ["Field “Technology” → Cybersecurity 100", F.jobFit({a:{mode:"field",field:"technology"}},"cy"), 100],
    ["Field “Technology” → Law 0", F.jobFit({a:{mode:"field",field:"technology"}},"lw"), 0],
    ["“I really don't know yet” → no Job Fit (null)", F.jobFit({a:{mode:"field",field:"none"}},"ds"), null],
    // ---- Interest Fit (section 10) ----
    ["RIASEC normalised: I all 5 → 1, R all 1 → 0, C all 3 → 0.5", [T.I,T.R,T.C].join(","), "1,0,0.5"],
    ["3-letter code I-C-R: R = 100×(3I+2C+1R)/6, no quick picks → P = R", F.interestFit({}, P("ds"), T), 100*(3*1+2*.5+0)/6, 1e-9],
    ["2-letter code R-I: R = 100×(3R+2I)/5", F.interestFit({}, P("ee"), T), 100*(3*0+2*1)/5, 1e-9],
    ["Free Saturday = first letter → 100; class party matches work focus → 100", F.interestFit({b2:{"b2-saturday":"I","b2-class-party":"Data"}}, P("ds"), T), 0.8*(400/6)+0.2*100, 1e-9],
    ["Free Saturday = second letter → 50 (only one quick pick answered)", F.interestFit({b2:{"b2-saturday":"C"}}, P("ds"), T), 0.8*(400/6)+0.2*50, 1e-9],
    ["Two matching deal-breakers → × 0.70 (Data Science: computer + math)", F.interestFit({b3:["b3-01","b3-03"]}, P("ds"), T) / F.interestFit({}, P("ds"), T), 0.70, 1e-9],
    ["Three matching deal-breakers still → × 0.70 (max 2; Medicine)", F.interestFit({b3:["b3-02","b3-07","b3-08"]}, P("md"), T) / F.interestFit({}, P("md"), T), 0.70, 1e-9],
    ["Non-matching deal-breaker → no change (Data Science: blood)", F.interestFit({b3:["b3-02"]}, P("ds"), T) / F.interestFit({}, P("ds"), T), 1, 1e-9],
    // ---- Personality (section 13) ----
    ["Type ENFP → Social 80, Big-picture 80, Heart-first 80, Planner 20", JSON.stringify(F.personality({c:{known:"yes",type:"ENFP"}})), JSON.stringify({social:80,big_picture:80,heart_first:80,planner:20})],
    ["Type “intj-t” is accepted (‑A/‑T ignored) → Planner 80", F.personality({c:{known:"yes",type:"intj-t"}}).planner, 80],
    ["Invalid type “ABCD” and no quiz → null", F.personality({c:{known:"yes",type:"ABCD"}}), null],
    ["Quiz item pointing to B: Definitely B → 100 (social, all three answers)", F.personality({c:{known:"no",quiz:quiz([0,3,0, 0,0,0, 0,0,0, 0,0,0])}}).social, 100],
    ["Quiz: Probably A on an A item = 67, on a B item = 33 → average", F.personality({c:{known:"no",quiz:quiz([1,1,1, 0,0,0, 0,0,0, 0,0,0])}}).social, (67+33+67)/3, 1e-9],
    ["Quiz with only 11 answers → quiz unavailable → null", F.personality({c:{known:"no",quiz:Object.fromEntries(Object.entries(quiz([0,0,0,0,0,0,0,0,0,0,0,0])).slice(1))}}), null],
    ["Type + quiz → average per dimension (ENFJ 80 and quiz 100 → 90)", F.personality({c:{known:"yes",type:"ENFJ",alsoQuiz:true,quiz:quiz([0,3,0, 0,0,0, 0,0,0, 0,0,0])}}).social, 90],
    // ---- Strength Fit (section 11) ----
    ["Logic: grades Math A + Physics C (avg 80), self 4 (75) → 0.6×80 + 0.4×75 = 78", F.skillScore({d1:{grades:{math:"A",physics:"C"}},d2:{logic:4}},"logic"), 78, 1e-9],
    ["Science: Biology B, Chemistry “Didn't study” → 80 (no self-rating for Science)", F.skillScore({d1:{grades:{biology:"B",chemistry:"none"}}},"science"), 80, 1e-9],
    ["Computer: only self-rating 5 → 100", F.skillScore({d2:{computer:5}},"computer"), 100, 1e-9],
    ["Grade E/F → 20", F.skillScore({d1:{grades:{english:"EF"}}},"english"), 20, 1e-9],
    ["No evidence for a major's skills → Strength Fit null (not 0)", F.strengthFit({}, P("ds")), null],
    ["Strength Fit = average of available skill scores (Data Science: Math self 3 → 50, Computer self 5 → 100, Logic no evidence)", F.strengthFit({d2:{computer:5,math:3}}, P("ds")), 75, 1e-9]
  ];
};
window.KITE_TEST_RESULTS = function(){
  return window.KITE_TESTS().map(([name, actual, expected, tol])=>{
    const ok = typeof expected==="number" && typeof actual==="number" ? Math.abs(actual-expected) <= (tol||0) : actual===expected;
    return {name, actual, expected, ok};
  });
};
