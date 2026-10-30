/* KITE — universities and scholarships.
   SAMPLE DATA for test mode: tuition, languages and requirements are placeholders and
   must be verified before launch. Confirm scholarship dates on the official site. */
(function(){
const D = window.KITE_DATA = window.KITE_DATA || {};

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

const SCHOLARSHIPS = [
  {id:"moeys",km:"អាហារូបករណ៍រដ្ឋាភិបាល នៅសាកលវិទ្យាល័យរដ្ឋ (ក្រសួងអប់រំ យុវជន និងកីឡា)",en:"Government scholarships at public universities (MoEYS)",when:{km:"ជាធម្មតាប្រកាសក្រោយលទ្ធផលប្រឡងបាក់ឌុប",en:"Usually announced after the BacII results"},url:"https://www.moeys.gov.kh",majors:"all"},
  {id:"uni",km:"អាហារូបករណ៍ផ្ទាល់របស់សាកលវិទ្យាល័យ (សិស្សពូកែ)",en:"Universities' own merit scholarships",when:{km:"ខុសគ្នាតាមសាកលវិទ្យាល័យ — មើលគេហទំព័រផ្លូវការ",en:"Varies by university — see the official site"},url:"",majors:"all"},
  {id:"mext",km:"អាហារូបករណ៍រដ្ឋាភិបាលជប៉ុន (MEXT) កម្រិតបរិញ្ញាបត្រ",en:"Japanese Government (MEXT) undergraduate scholarship",when:{km:"ជាធម្មតាបើកប្រហែលខែមេសា–ឧសភា",en:"Usually opens around April–May"},url:"https://www.kh.emb-japan.go.jp",majors:["cs","civ","ele","agr","bus","acc","arc","law"]},
  {id:"gks",km:"អាហារូបករណ៍រដ្ឋាភិបាលកូរ៉េ (GKS) កម្រិតបរិញ្ញាបត្រ",en:"Global Korea Scholarship (GKS) undergraduate",when:{km:"ជាធម្មតាបើកប្រហែលខែកញ្ញា–តុលា",en:"Usually opens around September–October"},url:"https://www.studyinkorea.go.kr",majors:"all"}
];

Object.assign(D, {UNIS,CITIES,SCHOLARSHIPS,DATA_CHECKED:null});
})();
