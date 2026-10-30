/* KITE — hidden scoring profile of each major. Only js/scoring.js reads this file.
   Later this file moves to the server, so students can't read it.
   jobs: related Part A job ids. ri: Holland interest weights.
   p: personality lean (+ = E, N, F, J; − = I, S, T, P). s: strength weights. */
(function(){
const D = window.KITE_DATA = window.KITE_DATA || {};

D.MAJOR_PROFILES = {
  cs:{jobs:["j2","j13"],ri:{I:1,R:.5,C:.5},p:{EI:-.3,SN:.5,TF:-.6,JP:.2},s:{math:1,tech:1,sci:.5,create:.4}},
  acc:{jobs:["j1","j9","j13"],ri:{C:1,E:.5,I:.3},p:{EI:0,SN:-.5,TF:-.4,JP:.8},s:{math:1,org:1,lang:.3}},
  bus:{jobs:["j8","j6","j9"],ri:{E:1,S:.5,C:.4,A:.3},p:{EI:.8,SN:.3,TF:0,JP:.3},s:{comm:1,org:.6,create:.5,lang:.4}},
  civ:{jobs:["j4","j18"],ri:{R:1,I:.8,C:.4},p:{EI:-.1,SN:-.2,TF:-.6,JP:.6},s:{math:1,sci:.8,tech:.8,org:.5}},
  ele:{jobs:["j7","j14"],ri:{R:1,I:.8},p:{EI:-.4,SN:0,TF:-.6,JP:.4},s:{math:.9,sci:1,tech:1}},
  nur:{jobs:["j3","j16","j12"],ri:{S:1,I:.6,R:.4},p:{EI:.2,SN:-.4,TF:.7,JP:.5},s:{care:1,sci:.8,org:.5}},
  edu:{jobs:["j5","j12"],ri:{S:1,A:.4,E:.3,C:.3},p:{EI:.5,SN:.2,TF:.6,JP:.5},s:{comm:1,care:.8,lang:.7,org:.5}},
  tour:{jobs:["j6","j8"],ri:{S:.9,E:.8,C:.3,A:.3},p:{EI:.9,SN:0,TF:.4,JP:0},s:{comm:1,lang:.8,care:.5,org:.5}},
  agr:{jobs:["j10"],ri:{R:1,I:.8,S:.2},p:{EI:-.2,SN:-.3,TF:0,JP:.3},s:{sci:1,tech:.6,math:.4}},
  arc:{jobs:["j18","j11"],ri:{A:1,R:.6,I:.5},p:{EI:-.1,SN:.8,TF:0,JP:-.1},s:{create:1,math:.6,tech:.5}},
  law:{jobs:["j15"],ri:{E:.8,I:.7,S:.4,C:.4},p:{EI:.3,SN:.3,TF:-.5,JP:.6},s:{lang:1,comm:.9,org:.5}},
  psy:{jobs:["j12","j5"],ri:{S:1,I:.7,A:.3},p:{EI:0,SN:.5,TF:.9,JP:0},s:{care:1,comm:.7,lang:.5}}
};
})();
