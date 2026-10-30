/* KITE — question bank, majors, universities, scholarships.
   All questions are KITE's own wording. University and scholarship figures are
   SAMPLE DATA for test mode and must be verified before launch. */
(function(){
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

/* Majors. jobs: related Part A job ids. ri: Holland weights. p: personality lean
   (+ = E, N, F, J; − = I, S, T, P). s: strength weights. track: preferred grade 12 track. */
const MAJORS = [
  {id:"cs",km:"វិទ្យាសាស្ត្រកុំព្យូទ័រ",en:"Computer Science",jobs:["j2","j13"],ri:{I:1,R:.5,C:.5},p:{EI:-.3,SN:.5,TF:-.6,JP:.2},s:{math:1,tech:1,sci:.5,create:.4},track:"sci",
   d:{km:"សិក្សាពីរបៀបសរសេរកម្មវិធី រចនាប្រព័ន្ធ និងដោះស្រាយបញ្ហាដោយប្រើកុំព្យូទ័រ។",en:"Learn to write software, design systems and solve problems with computers."},
   c:[{km:"អ្នកអភិវឌ្ឍកម្មវិធី",en:"Software developer"},{km:"អ្នកវិភាគទិន្នន័យ",en:"Data analyst"},{km:"អ្នកគ្រប់គ្រងប្រព័ន្ធ និងបណ្ដាញ",en:"Systems and network administrator"},{km:"អ្នកជំនាញសុវត្ថិភាពព័ត៌មាន",en:"Cybersecurity specialist"}]},
  {id:"acc",km:"គណនេយ្យ និងហិរញ្ញវត្ថុ",en:"Accounting & Finance",jobs:["j1","j9","j13"],ri:{C:1,E:.5,I:.3},p:{EI:0,SN:-.5,TF:-.4,JP:.8},s:{math:1,org:1,lang:.3},track:"any",
   d:{km:"សិក្សាពីការកត់ត្រា ការវិភាគ និងការគ្រប់គ្រងលុយរបស់ក្រុមហ៊ុន និងស្ថាប័ន។",en:"Learn how to record, analyse and manage money for companies and organisations."},
   c:[{km:"គណនេយ្យករ",en:"Accountant"},{km:"សវនករ",en:"Auditor"},{km:"មន្ត្រីឥណទាន",en:"Credit officer"},{km:"អ្នកវិភាគហិរញ្ញវត្ថុ",en:"Financial analyst"}]},
  {id:"bus",km:"គ្រប់គ្រងពាណិជ្ជកម្ម និងទីផ្សារ",en:"Business & Marketing",jobs:["j8","j6","j9"],ri:{E:1,S:.5,C:.4,A:.3},p:{EI:.8,SN:.3,TF:0,JP:.3},s:{comm:1,org:.6,create:.5,lang:.4},track:"any",
   d:{km:"សិក្សាពីរបៀបដំណើរការក្រុមហ៊ុន ការលក់ផលិតផល និងការដឹកនាំក្រុម។",en:"Learn how companies run, how products are sold and how to lead a team."},
   c:[{km:"មន្ត្រីទីផ្សារ",en:"Marketing officer"},{km:"អ្នកគ្រប់គ្រងការលក់",en:"Sales manager"},{km:"សហគ្រិន",en:"Entrepreneur"},{km:"អ្នកគ្រប់គ្រងសាខា",en:"Branch manager"}]},
  {id:"civ",km:"វិស្វកម្មសំណង់",en:"Civil Engineering",jobs:["j4","j18"],ri:{R:1,I:.8,C:.4},p:{EI:-.1,SN:-.2,TF:-.6,JP:.6},s:{math:1,sci:.8,tech:.8,org:.5},track:"sci",
   d:{km:"សិក្សាពីការរចនា និងសាងសង់អគារ ផ្លូវ ស្ពាន និងប្រព័ន្ធទឹក។",en:"Learn to design and build buildings, roads, bridges and water systems."},
   c:[{km:"វិស្វករសំណង់",en:"Civil engineer"},{km:"អ្នកគ្រប់គ្រងការដ្ឋាន",en:"Site manager"},{km:"អ្នកស្ទង់ដី",en:"Land surveyor"},{km:"អ្នករចនាផ្លូវ និងស្ពាន",en:"Road and bridge designer"}]},
  {id:"ele",km:"វិស្វកម្មអគ្គិសនី និងថាមពល",en:"Electrical & Energy Engineering",jobs:["j7","j14"],ri:{R:1,I:.8},p:{EI:-.4,SN:0,TF:-.6,JP:.4},s:{math:.9,sci:1,tech:1},track:"sci",
   d:{km:"សិក្សាពីអគ្គិសនី អេឡិចត្រូនិក និងថាមពលកកើតឡើងវិញ ដូចជាថាមពលព្រះអាទិត្យ។",en:"Learn about electricity, electronics and renewable energy such as solar power."},
   c:[{km:"វិស្វករអគ្គិសនី",en:"Electrical engineer"},{km:"អ្នកបច្ចេកទេសថាមពលព្រះអាទិត្យ",en:"Solar energy technician"},{km:"វិស្វករថែទាំរោងចក្រ",en:"Factory maintenance engineer"},{km:"អ្នករចនាប្រព័ន្ធភ្លើងអគារ",en:"Building electrical designer"}]},
  {id:"nur",km:"គិលានុបដ្ឋាក និងឆ្មប",en:"Nursing & Midwifery",jobs:["j3","j16","j12"],ri:{S:1,I:.6,R:.4},p:{EI:.2,SN:-.4,TF:.7,JP:.5},s:{care:1,sci:.8,org:.5},track:"sci",
   d:{km:"សិក្សាពីការថែទាំអ្នកជំងឺ សុខភាពម្ដាយ និងទារក ហើយធ្វើការជាមួយគ្រូពេទ្យ។",en:"Learn to care for patients and for mothers and babies, working alongside doctors."},
   c:[{km:"គិលានុបដ្ឋាក",en:"Nurse"},{km:"ឆ្មប",en:"Midwife"},{km:"គិលានុបដ្ឋាកសុខភាពសហគមន៍",en:"Community health nurse"},{km:"អ្នកសម្របសម្រួលកម្មវិធីសុខភាព",en:"Health programme coordinator"}]},
  {id:"edu",km:"អប់រំ និងគរុកោសល្យ",en:"Education & Teaching",jobs:["j5","j12"],ri:{S:1,A:.4,E:.3,C:.3},p:{EI:.5,SN:.2,TF:.6,JP:.5},s:{comm:1,care:.8,lang:.7,org:.5},track:"any",
   d:{km:"សិក្សាពីរបៀបបង្រៀន និងជួយសិស្សឱ្យរៀនបានល្អ ក្នុងមុខវិជ្ជាដែលអ្នកចូលចិត្ត។",en:"Learn how to teach and help students learn well in a subject you love."},
   c:[{km:"គ្រូបង្រៀន",en:"Teacher"},{km:"អ្នករៀបចំកម្មវិធីសិក្សា",en:"Curriculum developer"},{km:"គ្រូបង្វឹក",en:"Trainer"},{km:"អ្នកប្រឹក្សាការអប់រំ",en:"Education adviser"}]},
  {id:"tour",km:"ទេសចរណ៍ និងបដិសណ្ឋារកិច្ច",en:"Tourism & Hospitality",jobs:["j6","j8"],ri:{S:.9,E:.8,C:.3,A:.3},p:{EI:.9,SN:0,TF:.4,JP:0},s:{comm:1,lang:.8,care:.5,org:.5},track:"any",
   d:{km:"សិក្សាពីការគ្រប់គ្រងសណ្ឋាគារ ភោជនីយដ្ឋាន និងការនាំភ្ញៀវស្វែងយល់ពីកម្ពុជា។",en:"Learn to run hotels and restaurants and to show visitors around Cambodia."},
   c:[{km:"មគ្គុទ្ទេសក៍ទេសចរណ៍",en:"Tour guide"},{km:"អ្នកគ្រប់គ្រងសណ្ឋាគារ",en:"Hotel manager"},{km:"អ្នករៀបចំព្រឹត្តិការណ៍",en:"Event planner"},{km:"មន្ត្រីទីភ្នាក់ងារទេសចរណ៍",en:"Travel agency officer"}]},
  {id:"agr",km:"វិទ្យាសាស្ត្រកសិកម្ម",en:"Agricultural Science",jobs:["j10"],ri:{R:1,I:.8,S:.2},p:{EI:-.2,SN:-.3,TF:0,JP:.3},s:{sci:1,tech:.6,math:.4},track:"sci",
   d:{km:"សិក្សាពីដំណាំ សត្វ ដី និងបច្ចេកវិទ្យា ដើម្បីបង្កើនផលកសិកម្មកម្ពុជា។",en:"Learn about crops, animals, soil and technology to grow Cambodia's farm output."},
   c:[{km:"អ្នកបច្ចេកទេសកសិកម្ម",en:"Agricultural technician"},{km:"អ្នកស្រាវជ្រាវដំណាំ",en:"Crop researcher"},{km:"មន្ត្រីផ្សព្វផ្សាយកសិកម្ម",en:"Agricultural extension officer"},{km:"អ្នកគ្រប់គ្រងកសិដ្ឋាន",en:"Farm manager"}]},
  {id:"arc",km:"ស្ថាបត្យកម្ម និងការរចនា",en:"Architecture & Design",jobs:["j18","j11"],ri:{A:1,R:.6,I:.5},p:{EI:-.1,SN:.8,TF:0,JP:-.1},s:{create:1,math:.6,tech:.5},track:"any",
   d:{km:"សិក្សាពីការរចនាអគារ ផ្ទៃខាងក្នុង និងទីធ្លា ដោយរួមបញ្ចូលសិល្បៈ និងបច្ចេកទេស។",en:"Learn to design buildings, interiors and spaces by combining art and technique."},
   c:[{km:"ស្ថាបត្យករ",en:"Architect"},{km:"អ្នករចនាផ្ទៃខាងក្នុង",en:"Interior designer"},{km:"អ្នករចនាក្រាហ្វិក",en:"Graphic designer"},{km:"អ្នករៀបចំផែនការទីក្រុង",en:"Urban planner"}]},
  {id:"law",km:"នីតិសាស្ត្រ",en:"Law",jobs:["j15"],ri:{E:.8,I:.7,S:.4,C:.4},p:{EI:.3,SN:.3,TF:-.5,JP:.6},s:{lang:1,comm:.9,org:.5},track:"soc",
   d:{km:"សិក្សាពីច្បាប់កម្ពុជា និងអន្តរជាតិ របៀបការពារសិទ្ធិ និងដោះស្រាយវិវាទ។",en:"Learn Cambodian and international law, how to protect rights and settle disputes."},
   c:[{km:"មេធាវី",en:"Lawyer"},{km:"មន្ត្រីច្បាប់ក្នុងក្រុមហ៊ុន",en:"Company legal officer"},{km:"ចៅក្រម ឬព្រះរាជអាជ្ញា (តាមរយៈការប្រឡង)",en:"Judge or prosecutor (by exam)"},{km:"អ្នកស្រាវជ្រាវគោលនយោបាយ",en:"Policy researcher"}]},
  {id:"psy",km:"ចិត្តវិទ្យា និងសង្គមកិច្ច",en:"Psychology & Social Work",jobs:["j12","j5"],ri:{S:1,I:.7,A:.3},p:{EI:0,SN:.5,TF:.9,JP:0},s:{care:1,comm:.7,lang:.5},track:"any",
   d:{km:"សិក្សាពីរបៀបដែលមនុស្សគិត និងមានអារម្មណ៍ ហើយរបៀបជួយក្រុមគ្រួសារ និងសហគមន៍។",en:"Learn how people think and feel, and how to support families and communities."},
   c:[{km:"អ្នកប្រឹក្សាយោបល់",en:"Counsellor"},{km:"បុគ្គលិកសង្គមកិច្ច",en:"Social worker"},{km:"មន្ត្រីធនធានមនុស្ស",en:"HR officer"},{km:"បុគ្គលិកអង្គការ",en:"NGO programme officer"}]}
];

/* SAMPLE university data — tuition, languages and requirements are placeholders to verify. */
const UNIS = [
  {id:"rupp",km:"សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ (RUPP)",en:"Royal University of Phnom Penh (RUPP)",city:"pp",fee:[500,800],lang:{km:"ខ្មែរ / អង់គ្លេស",en:"Khmer / English"},req:{km:"សញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិ (បាក់ឌុប); ខ្លះមានប្រឡងចូល",en:"Grade 12 certificate (BacII); some programs have an entrance exam"},url:"https://www.rupp.edu.kh",sch:true,majors:["cs","psy","edu","tour"]},
  {id:"itc",km:"វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា (ITC)",en:"Institute of Technology of Cambodia (ITC)",city:"pp",fee:[550,900],lang:{km:"ខ្មែរ / បារាំង / អង់គ្លេស",en:"Khmer / French / English"},req:{km:"បាក់ឌុបថ្នាក់វិទ្យាសាស្ត្រ និងប្រឡងចូល",en:"BacII (Science track) and entrance exam"},url:"https://itc.edu.kh",sch:true,majors:["civ","ele","cs","agr"]},
  {id:"num",km:"សាកលវិទ្យាល័យជាតិគ្រប់គ្រង (NUM)",en:"National University of Management (NUM)",city:"pp",fee:[500,900],lang:{km:"ខ្មែរ / អង់គ្លេស",en:"Khmer / English"},req:{km:"បាក់ឌុប",en:"BacII"},url:"https://www.num.edu.kh",sch:true,majors:["acc","bus","tour","cs"]},
  {id:"rule",km:"សាកលវិទ្យាល័យភូមិន្ទនីតិសាស្ត្រ និងវិទ្យាសាស្ត្រសេដ្ឋកិច្ច (RULE)",en:"Royal University of Law and Economics (RULE)",city:"pp",fee:[450,900],lang:{km:"ខ្មែរ / អង់គ្លេស / បារាំង",en:"Khmer / English / French"},req:{km:"បាក់ឌុប",en:"BacII"},url:"https://www.rule.edu.kh",sch:true,majors:["law","acc","bus"]},
  {id:"uhs",km:"សាកលវិទ្យាល័យវិទ្យាសាស្ត្រសុខាភិបាល (UHS)",en:"University of Health Sciences (UHS)",city:"pp",fee:[700,1500],lang:{km:"ខ្មែរ / បារាំង / អង់គ្លេស",en:"Khmer / French / English"},req:{km:"បាក់ឌុបថ្នាក់វិទ្យាសាស្ត្រ និងប្រឡងចូល",en:"BacII (Science track) and entrance exam"},url:"https://www.uhs.edu.kh",sch:true,majors:["nur"]},
  {id:"up",km:"សាកលវិទ្យាល័យពុទ្ធិសាស្ត្រ (UP)",en:"University of Puthisastra (UP)",city:"pp",fee:[1000,2500],lang:{km:"អង់គ្លេស / ខ្មែរ",en:"English / Khmer"},req:{km:"បាក់ឌុប និងសម្ភាសន៍",en:"BacII and interview"},url:"https://www.puthisastra.edu.kh",sch:true,majors:["nur","cs","bus"]},
  {id:"rua",km:"សាកលវិទ្យាល័យភូមិន្ទកសិកម្ម (RUA)",en:"Royal University of Agriculture (RUA)",city:"pp",fee:[400,700],lang:{km:"ខ្មែរ / អង់គ្លេស",en:"Khmer / English"},req:{km:"បាក់ឌុប",en:"BacII"},url:"https://www.rua.edu.kh",sch:true,majors:["agr"]},
  {id:"rufa",km:"សាកលវិទ្យាល័យភូមិន្ទវិចិត្រសិល្បៈ (RUFA)",en:"Royal University of Fine Arts (RUFA)",city:"pp",fee:[400,800],lang:{km:"ខ្មែរ",en:"Khmer"},req:{km:"បាក់ឌុប និងតេស្តគំនូរ",en:"BacII and a drawing test"},url:"https://www.rufa.edu.kh",sch:false,majors:["arc"]},
  {id:"cadt",km:"បណ្ឌិត្យសភាបច្ចេកវិទ្យាឌីជីថលកម្ពុជា (CADT)",en:"Cambodia Academy of Digital Technology (CADT)",city:"pp",fee:[800,1500],lang:{km:"អង់គ្លេស / ខ្មែរ",en:"English / Khmer"},req:{km:"បាក់ឌុប និងប្រឡងចូល",en:"BacII and entrance exam"},url:"https://www.cadt.edu.kh",sch:true,majors:["cs"]},
  {id:"npic",km:"វិទ្យាស្ថានជាតិពហុបច្ចេកទេសកម្ពុជា (NPIC)",en:"National Polytechnic Institute of Cambodia (NPIC)",city:"pp",fee:[400,700],lang:{km:"ខ្មែរ",en:"Khmer"},req:{km:"បាក់ឌុប",en:"BacII"},url:"https://www.npic.edu.kh",sch:true,majors:["ele","civ"]},
  {id:"aupp",km:"សាកលវិទ្យាល័យអាមេរិកាំងភ្នំពេញ (AUPP)",en:"American University of Phnom Penh (AUPP)",city:"pp",fee:[7000,9500],lang:{km:"អង់គ្លេស",en:"English"},req:{km:"បាក់ឌុប ពាក្យសុំ និងកម្រិតភាសាអង់គ្លេស",en:"BacII, application and English level"},url:"https://www.aupp.edu.kh",sch:true,majors:["cs","bus","law","civ"]},
  {id:"puc",km:"សាកលវិទ្យាល័យបញ្ញាសាស្ត្រកម្ពុជា (PUC)",en:"Paññāsāstra University of Cambodia (PUC)",city:"pp",fee:[1000,2000],lang:{km:"អង់គ្លេស",en:"English"},req:{km:"បាក់ឌុប និងតេស្តភាសាអង់គ្លេស",en:"BacII and English placement test"},url:"https://www.puc.edu.kh",sch:true,majors:["law","bus","psy","tour"]},
  {id:"ubb",km:"សាកលវិទ្យាល័យបាត់ដំបង (UBB)",en:"University of Battambang (UBB)",city:"btb",fee:[350,600],lang:{km:"ខ្មែរ",en:"Khmer"},req:{km:"បាក់ឌុប",en:"BacII"},url:"https://www.ubb.edu.kh",sch:true,majors:["agr","acc","edu","cs","bus"]},
  {id:"bbu",km:"សាកលវិទ្យាល័យប៊ីលប្រាយ (BBU) — សាខាសៀមរាប",en:"Build Bright University (BBU), Siem Reap campus",city:"sr",fee:[500,900],lang:{km:"ខ្មែរ / អង់គ្លេស",en:"Khmer / English"},req:{km:"បាក់ឌុប",en:"BacII"},url:"https://www.bbu.edu.kh",sch:true,majors:["tour","bus","acc","cs","law"]}
];
const CITIES = {pp:{km:"ភ្នំពេញ",en:"Phnom Penh"},btb:{km:"បាត់ដំបង",en:"Battambang"},sr:{km:"សៀមរាប",en:"Siem Reap"}};

/* SAMPLE scholarships — usual timing only; confirm dates on the official site. */
const SCHOLARSHIPS = [
  {id:"moeys",km:"អាហារូបករណ៍រដ្ឋាភិបាល នៅសាកលវិទ្យាល័យរដ្ឋ (ក្រសួងអប់រំ យុវជន និងកីឡា)",en:"Government scholarships at public universities (MoEYS)",when:{km:"ជាធម្មតាប្រកាសក្រោយលទ្ធផលប្រឡងបាក់ឌុប",en:"Usually announced after the BacII results"},url:"https://www.moeys.gov.kh",majors:"all"},
  {id:"uni",km:"អាហារូបករណ៍ផ្ទាល់របស់សាកលវិទ្យាល័យ (សិស្សពូកែ)",en:"Universities' own merit scholarships",when:{km:"ខុសគ្នាតាមសាកលវិទ្យាល័យ — មើលគេហទំព័រផ្លូវការ",en:"Varies by university — see the official site"},url:"",majors:"all"},
  {id:"mext",km:"អាហារូបករណ៍រដ្ឋាភិបាលជប៉ុន (MEXT) កម្រិតបរិញ្ញាបត្រ",en:"Japanese Government (MEXT) undergraduate scholarship",when:{km:"ជាធម្មតាបើកប្រហែលខែមេសា–ឧសភា",en:"Usually opens around April–May"},url:"https://www.kh.emb-japan.go.jp",majors:["cs","civ","ele","agr","bus","acc","arc","law"]},
  {id:"gks",km:"អាហារូបករណ៍រដ្ឋាភិបាលកូរ៉េ (GKS) កម្រិតបរិញ្ញាបត្រ",en:"Global Korea Scholarship (GKS) undergraduate",when:{km:"ជាធម្មតាបើកប្រហែលខែកញ្ញា–តុលា",en:"Usually opens around September–October"},url:"https://www.studyinkorea.go.kr",majors:"all"}
];

window.KITE_DATA = {SCALE,PARTS,JOBS,ACTS,PERS,STRENGTHS,SKILLS,TRACKS,MAJORS,UNIS,CITIES,SCHOLARSHIPS,DATA_CHECKED:null};
})();
