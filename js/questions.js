/* KITE — question bank: answer scales, parts, and all test questions.
   All questions are KITE's own wording.
   Hidden scoring keys live inside the items (t = work tasks, k = interest or strength type,
   d = personality pair). Only js/scoring.js reads them; they are never shown on screen. */
(function(){
const D = window.KITE_DATA = window.KITE_DATA || {};

const SCALE = {
  want:[{km:"មិនចង់សោះ",en:"Not at all"},{km:"មិនសូវចង់",en:"Not really"},{km:"មិនប្រាកដ",en:"Not sure"},{km:"ចង់",en:"Yes"},{km:"ចង់ខ្លាំង",en:"Very much"}],
  like:[{km:"មិនចូលចិត្តសោះ",en:"Dislike a lot"},{km:"មិនសូវចូលចិត្ត",en:"Dislike"},{km:"ធម្មតា",en:"Neutral"},{km:"ចូលចិត្ត",en:"Like"},{km:"ចូលចិត្តខ្លាំង",en:"Like a lot"}],
  good:[{km:"ខ្សោយ",en:"Weak"},{km:"មិនសូវពូកែ",en:"Below average"},{km:"មធ្យម",en:"Average"},{km:"ពូកែ",en:"Good"},{km:"ពូកែខ្លាំង",en:"Very good"}]
};

const PARTS = {
  A:{km:"ការងារអនាគត",en:"Future jobs",stem:{km:"តើអ្នកចង់ធ្វើការងារនេះនៅថ្ងៃអនាគតប៉ុណ្ណា?",en:"How much would you like to do this job in the future?"},scale:"want"},
  B:{km:"ចំណាប់អារម្មណ៍",en:"Interests",stem:{km:"តើអ្នកនឹងចូលចិត្តធ្វើសកម្មភាពនេះប៉ុណ្ណា?",en:"How much would you enjoy this activity?"},scale:"like"},
  C:{km:"បុគ្គលិកលក្ខណៈ",en:"Personality",stem:{km:"ជ្រើសរើសមួយដែលដូចអ្នកជាង",en:"Pick the one that sounds more like you"}},
  D:{km:"ចំណុចខ្លាំង",en:"Strengths",stem:{km:"តើអ្នកពូកែលើចំណុចនេះប៉ុណ្ណា?",en:"How good are you at this?"},scale:"good"}
};

/* Part A — job names follow in-demand occupations listed in the MLVT labour-market report.
   tasks: D=data, I=ideas, P=people, T=things (Prediger) */
const JOBS = [
  {id:"j1",km:"គណនេយ្យករ",en:"Accountant",t:"D"},
  {id:"j2",km:"អ្នកអភិវឌ្ឍកម្មវិធីកុំព្យូទ័រ",en:"Software developer",t:"IT"},
  {id:"j3",km:"គិលានុបដ្ឋាក",en:"Nurse",t:"PT"},
  {id:"j4",km:"វិស្វករសំណង់",en:"Civil engineer",t:"TI"},
  {id:"j5",km:"គ្រូបង្រៀន",en:"Teacher",t:"PI"},
  {id:"j6",km:"អ្នកគ្រប់គ្រងសណ្ឋាគារ",en:"Hotel manager",t:"PD"},
  {id:"j7",km:"ជាងអគ្គិសនី",en:"Electrician",t:"T"},
  {id:"j8",km:"មន្ត្រីទីផ្សារ",en:"Marketing officer",t:"PI"},
  {id:"j9",km:"មន្ត្រីធនាគារ",en:"Bank officer",t:"DP"},
  {id:"j10",km:"អ្នកបច្ចេកទេសកសិកម្ម",en:"Agricultural technician",t:"TI"},
  {id:"j11",km:"អ្នករចនាក្រាហ្វិក",en:"Graphic designer",t:"I"},
  {id:"j12",km:"បុគ្គលិកសង្គមកិច្ច",en:"Social worker",t:"P"},
  {id:"j13",km:"អ្នកវិភាគទិន្នន័យ",en:"Data analyst",t:"DI"},
  {id:"j14",km:"ជាងម៉ាស៊ីនយានយន្ត",en:"Automotive technician",t:"T"},
  {id:"j15",km:"មេធាវី",en:"Lawyer",t:"IP"},
  {id:"j16",km:"ឱសថការី",en:"Pharmacist",t:"DT"},
  {id:"j17",km:"អ្នកសម្របសម្រួលការដឹកជញ្ជូន",en:"Logistics coordinator",t:"DT"},
  {id:"j18",km:"ស្ថាបត្យករ",en:"Architect",t:"IT"}
];

/* Part B — interest activities, tagged with Holland type R I A S E C */
const ACTS = [
  {id:"b1",k:"R",km:"ជួសជុលកង់ ឬម៉ូតូ",en:"Fix a bicycle or motorbike"},
  {id:"b2",k:"I",km:"ធ្វើពិសោធន៍វិទ្យាសាស្ត្រ",en:"Do a science experiment"},
  {id:"b3",k:"A",km:"គូររូប ឬរចនាផ្ទាំងរូបភាព",en:"Draw or design a poster"},
  {id:"b4",k:"S",km:"ជួយមិត្តភក្តិដោះស្រាយបញ្ហា",en:"Help a friend with a problem"},
  {id:"b5",k:"E",km:"ដឹកនាំគម្រោងក្រុម",en:"Lead a group project"},
  {id:"b6",k:"C",km:"កត់ត្រាចំណូលចំណាយរបស់ក្លឹប",en:"Keep the money records for a club"},
  {id:"b7",k:"R",km:"សាងសង់របស់អ្វីមួយដោយប្រើឈើ ឬឧបករណ៍",en:"Build something with wood or tools"},
  {id:"b8",k:"I",km:"ដោះស្រាយល្បែងប្រាជ្ញា ឬគណិតវិទ្យាពិបាកៗ",en:"Solve a hard logic or math puzzle"},
  {id:"b9",k:"A",km:"សរសេររឿង ឬកំណាព្យ",en:"Write a story or a poem"},
  {id:"b10",k:"S",km:"បង្រៀនសិស្សប្អូនៗ",en:"Teach younger students"},
  {id:"b11",k:"E",km:"លក់ផលិតផល ឬបញ្ចុះបញ្ចូលគេឱ្យទទួលយកគំនិត",en:"Sell a product or win people over to an idea"},
  {id:"b12",k:"C",km:"រៀបចំឯកសារ ឬកាលវិភាគឱ្យមានរបៀប",en:"Put files or a schedule in order"},
  {id:"b13",k:"R",km:"ដាំដំណាំ ឬចិញ្ចឹមសត្វ",en:"Grow plants or raise animals"},
  {id:"b14",k:"I",km:"ស្វែងរកមូលហេតុដែលរឿងអ្វីមួយកើតឡើង",en:"Find out why something happens"},
  {id:"b15",k:"A",km:"ថតរូប ឬកាត់តវីដេអូ",en:"Take photos or edit videos"},
  {id:"b16",k:"S",km:"ធ្វើការស្ម័គ្រចិត្តក្នុងសហគមន៍",en:"Volunteer in your community"},
  {id:"b17",k:"E",km:"ចាប់ផ្ដើមអាជីវកម្មខ្នាតតូចមួយ",en:"Start a small business"},
  {id:"b18",k:"C",km:"ពិនិត្យការងាររកកំហុស",en:"Check work for mistakes"},
  {id:"b19",k:"R",km:"តម្លើងខ្សែភ្លើង ឬគ្រឿងអេឡិចត្រូនិក",en:"Wire up lights or electronics"},
  {id:"b20",k:"I",km:"រៀនពីរបៀបដែលកុំព្យូទ័រ ឬរាងកាយមនុស្សដំណើរការ",en:"Learn how computers or the human body work"},
  {id:"b21",k:"A",km:"លេងតន្ត្រី ច្រៀង ឬរាំ",en:"Play music, sing or dance"},
  {id:"b22",k:"S",km:"មើលថែអ្នកឈឺ ឬមនុស្សចាស់",en:"Look after someone who is sick or elderly"},
  {id:"b23",k:"E",km:"និយាយនៅមុខមនុស្សច្រើន",en:"Speak in front of a crowd"},
  {id:"b24",k:"C",km:"បញ្ចូលទិន្នន័យក្នុងតារាង Excel",en:"Enter data into a spreadsheet"}
];

/* Part C — 12 forced-choice items. a = first letter of the pair, b = second */
const PERS = [
  {id:"c1",d:"EI",km:"នៅក្នុងពិធីជប់លៀង ខ្ញុំ…",en:"At a party, I…",a:{km:"និយាយលេងជាមួយមនុស្សថ្មីៗជាច្រើន",en:"chat with lots of new people"},b:{km:"និយាយតែជាមួយមិត្តជិតស្និទ្ធម្នាក់ ឬពីរនាក់",en:"talk with one or two close friends"}},
  {id:"c2",d:"SN",km:"ខ្ញុំជឿជាក់លើ…",en:"I trust…",a:{km:"ការពិតដែលខ្ញុំអាចមើលឃើញ",en:"facts I can see"},b:{km:"គំនិត និងការស្មានរបស់ខ្ញុំ",en:"my ideas and hunches"}},
  {id:"c3",d:"TF",km:"ពេលមិត្តធ្វើខុស រឿងដំបូងដែលខ្ញុំធ្វើគឺ…",en:"When a friend makes a mistake, I first…",a:{km:"ពន្យល់ថាខុសត្រង់ណា",en:"explain what went wrong"},b:{km:"ធ្វើឱ្យគាត់មានអារម្មណ៍ល្អវិញ",en:"make sure they feel OK"}},
  {id:"c4",d:"JP",km:"ចំពោះកិច្ចការផ្ទះ ខ្ញុំ…",en:"With homework, I…",a:{km:"ធ្វើរួចមុនពេល ដោយមានផែនការ",en:"finish early with a plan"},b:{km:"ធ្វើបានល្អជាងពេលជិតដល់ថ្ងៃកំណត់",en:"work best close to the deadline"}},
  {id:"c5",d:"EI",km:"បន្ទាប់ពីមួយសប្ដាហ៍នឿយហត់ ខ្ញុំសម្រាកដោយ…",en:"After a tiring week, I recharge by…",a:{km:"ចេញទៅលេងជាមួយមិត្តភក្តិ",en:"going out with friends"},b:{km:"នៅស្ងៀមម្នាក់ឯង",en:"spending quiet time alone"}},
  {id:"c6",d:"SN",km:"ខ្ញុំចូលចិត្តមេរៀនដែល…",en:"I like lessons that are…",a:{km:"អនុវត្តជាក់ស្ដែង មួយជំហានម្ដងៗ",en:"practical and step by step"},b:{km:"និយាយពីគំនិតធំៗ និងលទ្ធភាពថ្មីៗ",en:"about big ideas and new possibilities"}},
  {id:"c7",d:"TF",km:"ពេលសម្រេចចិត្តរឿងធំ ខ្ញុំពឹងលើ…",en:"For big decisions, I rely on…",a:{km:"ហេតុផល និងការពិត",en:"logic and facts"},b:{km:"អារម្មណ៍របស់មនុស្សជុំវិញខ្លួន",en:"how the people around me will feel"}},
  {id:"c8",d:"JP",km:"នៅចុងសប្ដាហ៍ ខ្ញុំចូលចិត្ត…",en:"On weekends, I like…",a:{km:"មានផែនការច្បាស់លាស់",en:"having a clear plan"},b:{km:"ធ្វើតាមចិត្ត មើលថាមានអ្វីកើតឡើង",en:"going with the flow"}},
  {id:"c9",d:"EI",km:"ក្នុងថ្នាក់រៀន ខ្ញុំចូលចិត្ត…",en:"In class, I prefer to…",a:{km:"បញ្ចេញគំនិតភ្លាមៗ",en:"share ideas out loud right away"},b:{km:"គិតឱ្យរួចសិន ទើបនិយាយ",en:"think first, then speak"}},
  {id:"c10",d:"SN",km:"ពេលរៀបរាប់ពីដំណើរកម្សាន្ត ខ្ញុំនិយាយពី…",en:"When I describe a trip, I talk about…",a:{km:"អ្វីដែលបានកើតឡើងយ៉ាងពិតប្រាកដ",en:"exactly what happened"},b:{km:"អត្ថន័យ និងអារម្មណ៍នៃដំណើរនោះ",en:"what it meant and how it felt"}},
  {id:"c11",d:"TF",km:"ខ្ញុំចង់ឱ្យគេស្គាល់ខ្ញុំថាជាមនុស្ស…",en:"I'd rather be known as…",a:{km:"យុត្តិធម៌ និងស្មោះត្រង់",en:"fair and honest"},b:{km:"ចិត្តល្អ និងយកចិត្តទុកដាក់",en:"kind and caring"}},
  {id:"c12",d:"JP",km:"តុរៀនរបស់ខ្ញុំជាធម្មតា…",en:"My desk is usually…",a:{km:"ស្អាត និងមានរបៀប",en:"neat and organized"},b:{km:"រញ៉េរញ៉ៃបន្តិច តែខ្ញុំរកអ្វីៗឃើញ",en:"a bit messy, but I can find things"}}
];

/* Part D — strengths. k = strength key */
const STRENGTHS = {
  math:{km:"គណិតវិទ្យា",en:"Math"}, sci:{km:"វិទ្យាសាស្ត្រ",en:"Science"}, lang:{km:"ភាសា និងការសរសេរ",en:"Language & writing"},
  comm:{km:"ការប្រាស្រ័យទាក់ទង",en:"Communication"}, create:{km:"ការច្នៃប្រឌិត",en:"Creativity"}, tech:{km:"បច្ចេកទេស",en:"Technical skill"},
  org:{km:"ការរៀបចំ",en:"Organizing"}, care:{km:"ការយកចិត្តទុកដាក់លើអ្នកដទៃ",en:"Caring for others"}
};
const SKILLS = [
  {id:"d1",k:"math",km:"ដោះស្រាយលំហាត់គណិតវិទ្យា",en:"Solving math problems"},
  {id:"d2",k:"sci",km:"យល់មុខវិជ្ជារូបវិទ្យា គីមីវិទ្យា ឬជីវវិទ្យា",en:"Understanding physics, chemistry or biology"},
  {id:"d3",k:"lang",km:"សរសេរតែងសេចក្ដីបានច្បាស់លាស់",en:"Writing clear essays"},
  {id:"d4",k:"comm",km:"ពន្យល់គំនិតឱ្យអ្នកដទៃយល់",en:"Explaining ideas so others understand"},
  {id:"d5",k:"create",km:"បង្កើតគំនិតថ្មីៗ",en:"Coming up with new ideas"},
  {id:"d6",k:"tech",km:"ប្រើកុំព្យូទ័រ និងកម្មវិធីផ្សេងៗ",en:"Using computers and apps"},
  {id:"d7",k:"org",km:"រៀបចំផែនការ និងរក្សារបៀបរៀបរយ",en:"Planning and keeping things in order"},
  {id:"d8",k:"care",km:"ស្ដាប់ និងយល់ពីអារម្មណ៍អ្នកដទៃ",en:"Listening to and understanding how others feel"},
  {id:"d9",k:"math",km:"គណនាលេខបានលឿន និងត្រឹមត្រូវ",en:"Working with numbers quickly and accurately"},
  {id:"d10",k:"sci",km:"រៀបចំ និងធ្វើពិសោធន៍",en:"Setting up and running experiments"},
  {id:"d11",k:"lang",km:"រៀនភាសាអង់គ្លេស ឬភាសាបរទេសផ្សេងទៀត",en:"Learning English or another language"},
  {id:"d12",k:"comm",km:"បញ្ចុះបញ្ចូលមនុស្ស",en:"Persuading people"},
  {id:"d13",k:"create",km:"គូររូប ឬរចនា",en:"Drawing or designing"},
  {id:"d14",k:"tech",km:"ជួសជុល ឬសាងសង់របស់ដោយដៃ",en:"Fixing or building things by hand"},
  {id:"d15",k:"org",km:"យកចិត្តទុកដាក់លើព័ត៌មានលម្អិតតូចៗ",en:"Paying attention to small details"},
  {id:"d16",k:"care",km:"នៅស្ងប់ស្ងាត់ពេលអ្នកដទៃត្រូវការជំនួយ",en:"Staying calm when someone needs help"}
];

const TRACKS = {
  sci:{km:"វិទ្យាសាស្ត្រ",en:"Science track"},
  soc:{km:"វិទ្យាសាស្ត្រសង្គម",en:"Social science track"},
  unsure:{km:"មិនទាន់ដឹង / ផ្សេងៗ",en:"Not sure / other"}
};

Object.assign(D, {SCALE,PARTS,JOBS,ACTS,PERS,STRENGTHS,SKILLS,TRACKS});
})();
