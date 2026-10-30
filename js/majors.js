/* KITE — majors: only what students see (name, description, careers).
   track: the grade 12 track a major usually takes ("sci", "soc" or "any"), used for admission notes.
   The hidden scoring profile of each major is in js/major-profiles.js. */
(function(){
const D = window.KITE_DATA = window.KITE_DATA || {};

const MAJORS = [
  {id:"cs",km:"វិទ្យាសាស្ត្រកុំព្យូទ័រ",en:"Computer Science",track:"sci",
   d:{km:"សិក្សាពីរបៀបសរសេរកម្មវិធី រចនាប្រព័ន្ធ និងដោះស្រាយបញ្ហាដោយប្រើកុំព្យូទ័រ។",en:"Learn to write software, design systems and solve problems with computers."},
   c:[{km:"អ្នកអភិវឌ្ឍកម្មវិធី",en:"Software developer"},{km:"អ្នកវិភាគទិន្នន័យ",en:"Data analyst"},{km:"អ្នកគ្រប់គ្រងប្រព័ន្ធ និងបណ្ដាញ",en:"Systems and network administrator"},{km:"អ្នកជំនាញសុវត្ថិភាពព័ត៌មាន",en:"Cybersecurity specialist"}]},
  {id:"acc",km:"គណនេយ្យ និងហិរញ្ញវត្ថុ",en:"Accounting & Finance",track:"any",
   d:{km:"សិក្សាពីការកត់ត្រា ការវិភាគ និងការគ្រប់គ្រងលុយរបស់ក្រុមហ៊ុន និងស្ថាប័ន។",en:"Learn how to record, analyse and manage money for companies and organisations."},
   c:[{km:"គណនេយ្យករ",en:"Accountant"},{km:"សវនករ",en:"Auditor"},{km:"មន្ត្រីឥណទាន",en:"Credit officer"},{km:"អ្នកវិភាគហិរញ្ញវត្ថុ",en:"Financial analyst"}]},
  {id:"bus",km:"គ្រប់គ្រងពាណិជ្ជកម្ម និងទីផ្សារ",en:"Business & Marketing",track:"any",
   d:{km:"សិក្សាពីរបៀបដំណើរការក្រុមហ៊ុន ការលក់ផលិតផល និងការដឹកនាំក្រុម។",en:"Learn how companies run, how products are sold and how to lead a team."},
   c:[{km:"មន្ត្រីទីផ្សារ",en:"Marketing officer"},{km:"អ្នកគ្រប់គ្រងការលក់",en:"Sales manager"},{km:"សហគ្រិន",en:"Entrepreneur"},{km:"អ្នកគ្រប់គ្រងសាខា",en:"Branch manager"}]},
  {id:"civ",km:"វិស្វកម្មសំណង់",en:"Civil Engineering",track:"sci",
   d:{km:"សិក្សាពីការរចនា និងសាងសង់អគារ ផ្លូវ ស្ពាន និងប្រព័ន្ធទឹក។",en:"Learn to design and build buildings, roads, bridges and water systems."},
   c:[{km:"វិស្វករសំណង់",en:"Civil engineer"},{km:"អ្នកគ្រប់គ្រងការដ្ឋាន",en:"Site manager"},{km:"អ្នកស្ទង់ដី",en:"Land surveyor"},{km:"អ្នករចនាផ្លូវ និងស្ពាន",en:"Road and bridge designer"}]},
  {id:"ele",km:"វិស្វកម្មអគ្គិសនី និងថាមពល",en:"Electrical & Energy Engineering",track:"sci",
   d:{km:"សិក្សាពីអគ្គិសនី អេឡិចត្រូនិក និងថាមពលកកើតឡើងវិញ ដូចជាថាមពលព្រះអាទិត្យ។",en:"Learn about electricity, electronics and renewable energy such as solar power."},
   c:[{km:"វិស្វករអគ្គិសនី",en:"Electrical engineer"},{km:"អ្នកបច្ចេកទេសថាមពលព្រះអាទិត្យ",en:"Solar energy technician"},{km:"វិស្វករថែទាំរោងចក្រ",en:"Factory maintenance engineer"},{km:"អ្នករចនាប្រព័ន្ធភ្លើងអគារ",en:"Building electrical designer"}]},
  {id:"nur",km:"គិលានុបដ្ឋាក និងឆ្មប",en:"Nursing & Midwifery",track:"sci",
   d:{km:"សិក្សាពីការថែទាំអ្នកជំងឺ សុខភាពម្ដាយ និងទារក ហើយធ្វើការជាមួយគ្រូពេទ្យ។",en:"Learn to care for patients and for mothers and babies, working alongside doctors."},
   c:[{km:"គិលានុបដ្ឋាក",en:"Nurse"},{km:"ឆ្មប",en:"Midwife"},{km:"គិលានុបដ្ឋាកសុខភាពសហគមន៍",en:"Community health nurse"},{km:"អ្នកសម្របសម្រួលកម្មវិធីសុខភាព",en:"Health programme coordinator"}]},
  {id:"edu",km:"អប់រំ និងគរុកោសល្យ",en:"Education & Teaching",track:"any",
   d:{km:"សិក្សាពីរបៀបបង្រៀន និងជួយសិស្សឱ្យរៀនបានល្អ ក្នុងមុខវិជ្ជាដែលអ្នកចូលចិត្ត។",en:"Learn how to teach and help students learn well in a subject you love."},
   c:[{km:"គ្រូបង្រៀន",en:"Teacher"},{km:"អ្នករៀបចំកម្មវិធីសិក្សា",en:"Curriculum developer"},{km:"គ្រូបង្វឹក",en:"Trainer"},{km:"អ្នកប្រឹក្សាការអប់រំ",en:"Education adviser"}]},
  {id:"tour",km:"ទេសចរណ៍ និងបដិសណ្ឋារកិច្ច",en:"Tourism & Hospitality",track:"any",
   d:{km:"សិក្សាពីការគ្រប់គ្រងសណ្ឋាគារ ភោជនីយដ្ឋាន និងការនាំភ្ញៀវស្វែងយល់ពីកម្ពុជា។",en:"Learn to run hotels and restaurants and to show visitors around Cambodia."},
   c:[{km:"មគ្គុទ្ទេសក៍ទេសចរណ៍",en:"Tour guide"},{km:"អ្នកគ្រប់គ្រងសណ្ឋាគារ",en:"Hotel manager"},{km:"អ្នករៀបចំព្រឹត្តិការណ៍",en:"Event planner"},{km:"មន្ត្រីទីភ្នាក់ងារទេសចរណ៍",en:"Travel agency officer"}]},
  {id:"agr",km:"វិទ្យាសាស្ត្រកសិកម្ម",en:"Agricultural Science",track:"sci",
   d:{km:"សិក្សាពីដំណាំ សត្វ ដី និងបច្ចេកវិទ្យា ដើម្បីបង្កើនផលកសិកម្មកម្ពុជា។",en:"Learn about crops, animals, soil and technology to grow Cambodia's farm output."},
   c:[{km:"អ្នកបច្ចេកទេសកសិកម្ម",en:"Agricultural technician"},{km:"អ្នកស្រាវជ្រាវដំណាំ",en:"Crop researcher"},{km:"មន្ត្រីផ្សព្វផ្សាយកសិកម្ម",en:"Agricultural extension officer"},{km:"អ្នកគ្រប់គ្រងកសិដ្ឋាន",en:"Farm manager"}]},
  {id:"arc",km:"ស្ថាបត្យកម្ម និងការរចនា",en:"Architecture & Design",track:"any",
   d:{km:"សិក្សាពីការរចនាអគារ ផ្ទៃខាងក្នុង និងទីធ្លា ដោយរួមបញ្ចូលសិល្បៈ និងបច្ចេកទេស។",en:"Learn to design buildings, interiors and spaces by combining art and technique."},
   c:[{km:"ស្ថាបត្យករ",en:"Architect"},{km:"អ្នករចនាផ្ទៃខាងក្នុង",en:"Interior designer"},{km:"អ្នករចនាក្រាហ្វិក",en:"Graphic designer"},{km:"អ្នករៀបចំផែនការទីក្រុង",en:"Urban planner"}]},
  {id:"law",km:"នីតិសាស្ត្រ",en:"Law",track:"soc",
   d:{km:"សិក្សាពីច្បាប់កម្ពុជា និងអន្តរជាតិ របៀបការពារសិទ្ធិ និងដោះស្រាយវិវាទ។",en:"Learn Cambodian and international law, how to protect rights and settle disputes."},
   c:[{km:"មេធាវី",en:"Lawyer"},{km:"មន្ត្រីច្បាប់ក្នុងក្រុមហ៊ុន",en:"Company legal officer"},{km:"ចៅក្រម ឬព្រះរាជអាជ្ញា (តាមរយៈការប្រឡង)",en:"Judge or prosecutor (by exam)"},{km:"អ្នកស្រាវជ្រាវគោលនយោបាយ",en:"Policy researcher"}]},
  {id:"psy",km:"ចិត្តវិទ្យា និងសង្គមកិច្ច",en:"Psychology & Social Work",track:"any",
   d:{km:"សិក្សាពីរបៀបដែលមនុស្សគិត និងមានអារម្មណ៍ ហើយរបៀបជួយក្រុមគ្រួសារ និងសហគមន៍។",en:"Learn how people think and feel, and how to support families and communities."},
   c:[{km:"អ្នកប្រឹក្សាយោបល់",en:"Counsellor"},{km:"បុគ្គលិកសង្គមកិច្ច",en:"Social worker"},{km:"មន្ត្រីធនធានមនុស្ស",en:"HR officer"},{km:"បុគ្គលិកអង្គការ",en:"NGO programme officer"}]}
];

D.MAJORS = MAJORS;
})();
