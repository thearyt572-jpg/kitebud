This version follows the existing KITEBud questionnaire and code. I am not changing the validated question set, personality approach, scoring formula, or 16 major profiles.

One clarification is applied to the job-selection explanation: students select one specific dream job if they have one. If they are unsure, they select a field/category instead. They do not rank or select 5–15 jobs.

Anything that does not yet have Khmer wording is marked [NEEDS KHMER] rather than silently translated or changed.
1. Questionnaire structure
Section	What it measures	Questions
A. Dream job / field	Career direction	1 choice
B1. RIASEC activities	Interests	30 activities
B2. Quick preferences	Work preferences	2 questions
B3. Deal-breakers	Work conditions students dislike	8 options
C. Personality	Four personality dimensions	12 questions
D1. School results	Academic strengths	7 subjects
D2. Self-assessed skills	Personal strengths	9 skills

The questionnaire also includes one attention-check item in B1. The personality section uses the existing 12 A/B questions and the optional personality-type input already in the code.

Pasted text(20261030-062705).txt
 The wording and scoring below are taken from the existing questionnaire source. The major profiles and their mappings are also taken from that source. The source does not contain full written descriptions for each major, so I have not invented any.
2. Part A — Dream job or field
Question
- English: Do you already have a dream job?
- Khmer: តើអ្នកមានការងារក្នុងក្តីស្រមៃហើយឬនៅ?
Option 1 — Has a dream job
- English: Yes, I have one — Pick one job.
- Khmer: មាន — ជ្រើសការងារមួយ។
The student searches or browses the career list and selects one specific job only.

Option 2 — Not sure yet
- English: Not sure yet — Choose a field instead.
- Khmer: មិនទាន់ប្រាកដ — ជ្រើសវិស័យជំនួសវិញ។
The student selects one field/category rather than choosing individual jobs.

The six career categories
Category	Khmer
💻 Tech	💻 បច្ចេកវិទ្យា
🏗️ Engineering	🏗️ វិស្វកម្ម
🩺 Health	🩺 សុខាភិបាល
💼 Business & money	💼 ពាណិជ្ជកម្ម និងហិរញ្ញវត្ថុ
🎨 Creative & design	🎨 ច្នៃប្រឌិត និងរចនា
🤝 People & service	🤝 សេវាកម្ម និងមនុស្ស

Field options for students who are unsure
Field	Khmer	Examples
Science & research	វិទ្យាសាស្ត្រ និងស្រាវជ្រាវ	lab work, medicine, data / មន្ទីរពិសោធន៍ វេជ្ជសាស្ត្រ ទិន្នន័យ
Technology	បច្ចេកវិទ្យា	coding, networks, data / សរសេរកូដ បណ្តាញ ទិន្នន័យ
Engineering & building	វិស្វកម្ម និងសំណង់	machines, electricity, construction / ម៉ាស៊ីន អគ្គិសនី សំណង់
Health & care	សុខាភិបាល និងការថែទាំ	hospitals, patients, wellbeing / មន្ទីរពេទ្យ អ្នកជំងឺ សុខុមាលភាព
Business & money	ពាណិជ្ជកម្ម និងហិរញ្ញវត្ថុ	banking, accounting, selling / ធនាគារ គណនេយ្យ ការលក់
Creative & design	ច្នៃប្រឌិត និងរចនា	design, media, content / រចនា ប្រព័ន្ធផ្សព្វផ្សាយ មាតិកា
People & service	មនុស្ស និងសេវាកម្ម	teaching, law, tourism, HR / បង្រៀន ច្បាប់ ទេសចរណ៍ ធនធានមនុស្ស

There is also this option:
- English: I really don't know yet.
- Khmer: ខ្ញុំពិតជាមិនទាន់ដឹងនៅឡើយ។
How Job Fit works
Student's answer	Job Fit for each major
Selects a specific dream job, and the major is directly linked to that job	100
Selects a specific dream job, and the major is another major in the same field	50
Selects a specific dream job, but the major is outside that job's field	0
Does not know a dream job, but selects a field containing that major	100
Does not know a dream job, and the major is outside the selected field	0
Does not know a dream job and selects no field	null — no Job Fit score

Important selection clarification: the existing code's field prompt says “Pick 1 or 2” and permits up to two fields. Your clarified student-facing design is one field only. The scoring formula itself can remain the same; the selection limit and wording need to reflect one selection.
3. Career list — selectable dream jobs
The following are the job options already present in the source, grouped under the existing six categories. Khmer wording is retained from the code.

Technology
English	Khmer
Web technician	អ្នកបច្ចេកទេសគេហទំព័រ
ICT operations technician	អ្នកបច្ចេកទេសប្រតិបត្តិការ ICT
Applications programmer	អ្នកសរសេរកម្មវិធីអនុវត្ត
Software developer	អ្នកអភិវឌ្ឍកម្មវិធី
Systems analyst	អ្នកវិភាគប្រព័ន្ធ
Computer network professional	អ្នកជំនាញបណ្តាញកុំព្យូទ័រ
IT trainer	គ្រូបង្វឹក IT
Data analyst	អ្នកវិភាគទិន្នន័យ
Data scientist	អ្នកវិទ្យាសាស្ត្រទិន្នន័យ
Data engineer	វិស្វករទិន្នន័យ
Business intelligence analyst	អ្នកវិភាគព័ត៌មានអាជីវកម្ម
Statistician	អ្នកស្ថិតិ
Machine learning engineer	វិស្វកររៀនសូត្ររបស់ម៉ាស៊ីន
AI specialist	អ្នកឯកទេសបញ្ញាសិប្បនិម្មិត
Database administrator	អ្នកគ្រប់គ្រងមូលដ្ឋានទិន្នន័យ
Software quality assurance tester	អ្នកត្រួតពិនិត្យគុណភាពកម្មវិធី
DevOps engineer	វិស្វករ DevOps
Cloud engineer	វិស្វករប្រព័ន្ធក្លោដ
Cybersecurity analyst	អ្នកវិភាគសន្តិសុខសាយប័រ
Digital forensics specialist	អ្នកឯកទេសកោសល្យវិច្ច័យឌីជីថល
IT project manager	អ្នកគ្រប់គ្រងគម្រោង IT
IT support specialist	អ្នកឯកទេសគាំទ្រ IT
GIS specialist	អ្នកឯកទេសប្រព័ន្ធព័ត៌មានភូមិសាស្ត្រ

Engineering
English	Khmer
Telecommunications engineer	វិស្វករទូរគមនាគមន៍
Electronics engineer	វិស្វករអេឡិចត្រូនិច
Civil engineer	វិស្វករសំណង់ស៊ីវិល
Surveyor	អ្នកវាស់វែងដី
Mechanical engineer	វិស្វករមេកានិច
Chemical engineer	វិស្វករគីមី
Industrial engineer	វិស្វករឧស្សាហកម្ម
Environmental engineer	វិស្វករបរិស្ថាន
Water resources engineer	វិស្វករធនធានទឹក
Transportation engineer	វិស្វករដឹកជញ្ជូន
Structural engineer	វិស្វកររចនាសម្ព័ន្ធ
Electrical power engineer	វិស្វករថាមពលអគ្គិសនី
Renewable energy engineer	វិស្វករថាមពលកកើតឡើងវិញ
Automotive technician	អ្នកបច្ចេកទេសយានយន្ត
BIM technician	អ្នកបច្ចេកទេស BIM
Quantity surveyor	អ្នកវាស់បរិមាណសំណង់
Occupational safety officer	មន្ត្រីសុវត្ថិភាពការងារ
Electrician	ជាងអគ្គិសនី
Plumber	ជាងទឹក
Welder	ជាងផ្សារដែក
Machinist	ជាងម៉ាស៊ីន
Refrigeration and air conditioning technician	អ្នកបច្ចេកទេសទូរទឹកកក និងម៉ាស៊ីនត្រជាក់
Quality control inspector	អ្នកត្រួតពិនិត្យគុណភាព
Construction supervisor	អ្នកគ្រប់គ្រងការដ្ឋានសំណង់
Aircraft maintenance technician	អ្នកបច្ចេកទេសថែទាំយន្តហោះ

Health
English	Khmer
Doctor or dentist	វេជ្ជបណ្ឌិត ឬទន្តពេទ្យ
Nurse or physiotherapist	គិលានុបដ្ឋាក ឬអ្នកព្យាបាលដោយចលនា
Pharmacist	ឱសថការី
Midwife	ឆ្មប
Medical laboratory scientist	អ្នកវិទ្យាសាស្ត្រមន្ទីរពិសោធន៍វេជ្ជសាស្ត្រ
Radiographer	អ្នកថតរូបភាពវេជ្ជសាស្ត្រ
Public health officer	មន្ត្រីសុខាភិបាលសាធារណៈ
Nutritionist	អ្នកឯកទេសអាហារូបត្ថម្ភ
Psychologist	អ្នកចិត្តវិទ្យា
Counselor	អ្នកប្រឹក្សាយោបល់
Veterinarian	ពេទ្យសត្វ
Emergency medical technician	អ្នកបច្ចេកទេសសង្គ្រោះបន្ទាន់
Health information officer	មន្ត្រីព័ត៌មានសុខាភិបាល

Business & money
English	Khmer
Accountant or auditor	គណនេយ្យករ ឬសវនករ
Financial adviser	ទីប្រឹក្សាហិរញ្ញវត្ថុ
Finance manager	អ្នកគ្រប់គ្រងហិរញ្ញវត្ថុ
Sales & marketing manager	អ្នកគ្រប់គ្រងផ្នែកលក់ និងទីផ្សារ
HR specialist or manager	អ្នកឯកទេស ឬអ្នកគ្រប់គ្រងធនធានមនុស្ស
Banking officer	មន្ត្រីធនាគារ
Risk analyst	អ្នកវិភាគហានិភ័យ
Actuary	អ្នកគណនាហានិភ័យធានារ៉ាប់រង
Insurance officer	មន្ត្រីធានារ៉ាប់រង
Tax consultant	ទីប្រឹក្សាពន្ធដារ
Internal auditor	សវនករផ្ទៃក្នុង
Procurement officer	មន្ត្រីលទ្ធកម្ម
Supply chain analyst	អ្នកវិភាគខ្សែសង្វាក់ផ្គត់ផ្គង់
Logistics coordinator	អ្នកសម្របសម្រួលភស្តុភារ
Project coordinator	អ្នកសម្របសម្រួលគម្រោង
Operations manager	អ្នកគ្រប់គ្រងប្រតិបត្តិការ
Entrepreneur	សហគ្រិន
Management consultant	ទីប្រឹក្សាគ្រប់គ្រង
Compliance officer	មន្ត្រីអនុលោមភាព
Administrative officer	មន្ត្រីរដ្ឋបាល
Customs officer	មន្ត្រីគយ
Real estate agent	ភ្នាក់ងារអចលនទ្រព្យ
E-commerce specialist	អ្នកឯកទេសពាណិជ្ជកម្មអេឡិចត្រូនិក
Warehouse supervisor	អ្នកគ្រប់គ្រងឃ្លាំង
Customer service representative	បុគ្គលិកសេវាអតិថិជន

Creative & design
English	Khmer
Architect / landscape architect	ស្ថាបត្យករ / ស្ថាបត្យករទេសភាព
Graphic & multimedia designer	អ្នករចនាក្រាហ្វិក និងពហុព័ត៌មាន
Web & multimedia developer	អ្នកអភិវឌ្ឍគេហទំព័រ និងពហុព័ត៌មាន
Advertising & PR manager	អ្នកគ្រប់គ្រងផ្សព្វផ្សាយ និងទំនាក់ទំនងសាធារណៈ
UX/UI designer	អ្នករចនា UX/UI
Digital marketing specialist	អ្នកឯកទេសទីផ្សារឌីជីថល
Content writer	អ្នកនិពន្ធមាតិកា
Journalist	អ្នកសារព័ត៌មាន
Photographer	អ្នកថតរូប
Video editor	អ្នកកាត់តវីដេអូ
Animator	អ្នកបង្កើតចលនារូបភាព
Translator or interpreter	អ្នកបកប្រែ
Communications officer	មន្ត្រីទំនាក់ទំនង
Brand manager	អ្នកគ្រប់គ្រងម៉ាកយីហោ
Event planner	អ្នករៀបចំព្រឹត្តិការណ៍

People & service
English	Khmer
Lawyer	មេធាវី
Hotel or restaurant manager	អ្នកគ្រប់គ្រងសណ្ឋាគារ ឬភោជនីយដ្ឋាន
Chef	ចុងភៅ
Teacher or lecturer	គ្រូបង្រៀន ឬសាស្ត្រាចារ្យ
Early childhood educator	អ្នកអប់រំកុមារតូច
Vocational trainer	គ្រូបណ្តុះបណ្តាលវិជ្ជាជីវៈ
Curriculum developer	អ្នកអភិវឌ្ឍកម្មវិធីសិក្សា
Librarian	បណ្ណារក្ស
Social worker	បុគ្គលិកសង្គមកិច្ច
NGO program officer	មន្ត្រីកម្មវិធីអង្គការមិនមែនរដ្ឋាភិបាល
Monitoring and evaluation officer	មន្ត្រីតាមដាន និងវាយតម្លៃ
Policy analyst	អ្នកវិភាគគោលនយោបាយ
Diplomat	អ្នកការទូត
Paralegal or legal assistant	ជំនួយការផ្នែកច្បាប់
Tour guide	មគ្គុទ្ទេសក៍ទេសចរណ៍
Hotel operations officer	មន្ត្រីប្រតិបត្តិការសណ្ឋាគារ
Hotel front desk officer	បុគ្គលិកទទួលភ្ញៀវសណ្ឋាគារ
Travel consultant	ទីប្រឹក្សាទេសចរណ៍
Pastry chef or baker	ចុងភៅនំ ឬអ្នកដុតនំ
Flight attendant	បុគ្គលិកបម្រើការលើយន្តហោះ
Civil servant	មន្ត្រីរាជការ
Police officer	មន្ត្រីនគរបាល
Firefighter	អ្នកពន្លត់អគ្គិភ័យ
Humanitarian aid worker	បុគ្គលិកជំនួយមនុស្សធម៌

Note: This is the job catalogue in the uploaded code. The code also allows a student to type a job that is not found in the list.
4. Part B1 — Interest questionnaire (30 activities)
Instruction
- English: How much do you enjoy this?
- Khmer: តើអ្នកចូលចិត្តវាកម្រិតណា?
- English: If you've never done it, imagine doing it.
- Khmer: បើមិនធ្លាប់ធ្វើ សូមស្រមៃថាអ្នកកំពុងធ្វើវា។
Students rate every activity using the same five-point scale.
No.	Activity (English)	សកម្មភាព (Khmer)	Type
1	Pumping up or patching a bicycle tire	បូមខ្យល់កង់ ឬប៉ះកង់ដែលធ្លុះ	R
2	Putting together a new shelf or table by following the picture	ដំឡើងធ្នើ ឬតុថ្មី ដោយមើលតាមរូបភាពណែនាំ	R
3	Helping plant or water vegetables at home	ជួយដាំ ឬស្រោចបន្លែនៅផ្ទះ	R
4	Cooking dinner for your family	ចម្អិនអាហារពេលល្ងាចសម្រាប់គ្រួសារ	R
5	Carrying and setting up tables and chairs for a family event	លើក និងរៀបចំតុកៅអីសម្រាប់កម្មវិធីគ្រួសារ	R
6	Searching online for the answer when nobody in your group knows it	ស្វែងរកចម្លើយតាមអ៊ីនធឺណិត នៅពេលគ្មាននរណាម្នាក់ក្នុងក្រុមដឹង	I
7	Trying to work out the trick behind a magic video	ព្យាយាមស្វែងយល់ពីល្បិចនៅពីក្រោយវីដេអូលេងប៉ាហី	I
8	Watching a video about why something happens (lightning, earthquakes, why we dream)	មើលវីដេអូអំពីមូលហេតុដែលអ្វីមួយកើតឡើង (ផ្លេកបន្ទោរ ការរញ្ជួយដី ហេតុអ្វីយើងយល់សប្តិ)	I
9	Wondering why some videos get millions of views and others don't	ឆ្ងល់ថាហេតុអ្វីវីដេអូខ្លះមានអ្នកមើលរាប់លាន តែខ្លះទៀតមិនមាន	I
10	Reading the ingredients on a snack or medicine packet	អានគ្រឿងផ្សំនៅលើកញ្ចប់នំ ឬកញ្ចប់ថ្នាំ	I
11	Choosing the filter and layout for a photo before posting it	ជ្រើសរើសហ្វីលធ័រ និងការរៀបចំរូបថត មុនពេលបង្ហោះ	A
12	Making a short video with music for social media	ធ្វើវីដេអូខ្លីដាក់តន្ត្រីសម្រាប់បណ្តាញសង្គម	A
13	Writing a funny caption or a birthday message for a friend	សរសេរចំណងជើងកំប្លែង ឬសារជូនពរថ្ងៃកំណើតដល់មិត្តភក្តិ	A
14	Rearranging your room so it looks nicer	រៀបចំបន្ទប់ឡើងវិញឱ្យមើលទៅស្អាតជាងមុន	A
15	Singing karaoke or dancing at a party	ច្រៀងខារ៉ាអូខេ ឬរាំនៅពិធីជប់លៀង	A
16	Explaining homework to a younger sibling or cousin	ពន្យល់កិច្ចការផ្ទះដល់ប្អូន ឬបងប្អូនជីដូនមួយ	S
17	Checking on a friend who seems quiet or sad	សួរសុខទុក្ខមិត្តភក្តិដែលមើលទៅស្ងាត់ ឬកើតទុក្ខ	S
18	Helping out at a pagoda ceremony or a relative's wedding	ជួយការងារនៅពិធីបុណ្យនៅវត្ត ឬពិធីមង្គលការសាច់ញាតិ	S
19	Being the friend people message when they have a problem	ជាមិត្តដែលគេផ្ញើសាររកនៅពេលពួកគេមានបញ្ហា	S
20	Helping a new student find their way around school	ជួយសិស្សថ្មីឱ្យស្គាល់កន្លែងនានានៅក្នុងសាលា	S
21	Reselling snacks or clothes to friends for a small profit	លក់នំបន្ត ឬសម្លៀកបំពាក់ឱ្យមិត្តភក្តិ ដើម្បីចំណេញបន្តិចបន្តួច	E
22	Being the one who decides where the group goes to eat	ជាអ្នកសម្រេចថាក្រុមនឹងទៅញ៉ាំនៅកន្លែងណា	E
23	Getting friends to join your plan for the weekend	បបួលមិត្តភក្តិឱ្យចូលរួមផែនការចុងសប្តាហ៍របស់អ្នក	E
24	Organizing a class party or trip	រៀបចំកម្មវិធីជប់លៀង ឬដំណើរកម្សាន្តរបស់ថ្នាក់	E
25	Bargaining for a better price at the market	តថ្លៃឱ្យបានតម្លៃល្អនៅផ្សារ	E
26	Keeping track of how you spend your pocket money	កត់ត្រាការចំណាយលុយហោប៉ៅរបស់អ្នក	C
27	Sorting your phone photos or school files into folders	រៀបចំរូបថតក្នុងទូរសព្ទ ឬឯកសារសាលាចូលក្នុងថតឯកសារ	C
28	Checking a friend's message or essay for spelling mistakes before they send it	ពិនិត្យរកកំហុសអក្ខរាវិរុទ្ធក្នុងសារ ឬអត្ថបទរបស់មិត្ត មុនពេលគេផ្ញើ	C
29	Following a recipe exactly, step by step	ធ្វើម្ហូបតាមរូបមន្តឱ្យបានត្រឹមត្រូវ មួយជំហានម្តងៗ	C
30	Writing a to-do list and ticking things off	សរសេរបញ្ជីការងារត្រូវធ្វើ ហើយគូសធីកនៅពេលធ្វើរួច	C

RIASEC types
Code	English	Khmer
R	Realistic	ជាក់ស្តែង
I	Investigative	ស្រាវជ្រាវ
A	Artistic	សិល្បៈ
S	Social	សង្គម
E	Enterprising	សហគ្រិន
C	Conventional	រៀបរយ

Rating scale
Score	English	Khmer
1	Hate it	ស្អប់
2	Dislike	មិនចូលចិត្ត
3	Not sure	មិនប្រាកដ
4	Like	ចូលចិត្ត
5	Love it	ចូលចិត្តខ្លាំង

Attention-check item
- English: To show you're reading, please choose “Like” for this one.
- Khmer: ដើម្បីបង្ហាញថាអ្នកកំពុងអាន សូមជ្រើសរើស “ចូលចិត្ត” សម្រាប់សំណួរនេះ។
Required response: 4 — Like / ចូលចិត្ត.
5. Part B2 — Quick preference questions
Question 1
- English: Free Saturday, no homework. What do you most likely do?
- Khmer: ថ្ងៃសៅរ៍ទំនេរ គ្មានកិច្ចការផ្ទះ។ តើអ្នកទំនងជានឹងធ្វើអ្វី?
Option	English	Khmer
R	Play sports or fix / build something	លេងកីឡា ឬជួសជុល / សាងសង់អ្វីមួយ
I	Watch videos and learn something new	មើលវីដេអូ និងរៀនអ្វីថ្មីៗ
A	Draw, play music or edit videos	គូររូប លេងតន្ត្រី ឬកាត់តវីដេអូ
S	Hang out with friends or help my family	ដើរលេងជាមួយមិត្តភក្តិ ឬជួយគ្រួសារ
E	Work on a small business or side hustle	រកស៊ីតូចតាច ឬធ្វើការងារបន្ថែម
C	Clean my room and plan my week	សម្អាតបន្ទប់ និងរៀបចំផែនការសប្តាហ៍

Question 2
- English: Your class wins 500,000 riel for a class party. Which job do you volunteer for?
- Khmer: ថ្នាក់របស់អ្នកឈ្នះប្រាក់ ៥០០.០០០ រៀល សម្រាប់ធ្វើកម្មវិធីជប់លៀង។ តើអ្នកស្ម័គ្រចិត្តធ្វើការងារមួយណា?
Option	English	Khmer
Data	Count the money and work out what we can afford	រាប់លុយ ហើយគណនាថាយើងអាចទិញអ្វីបាន
People	Tell everyone and get the whole class involved	ប្រាប់អ្នករាល់គ្នា និងបបួលថ្នាក់ទាំងមូលឱ្យចូលរួម
Things	Go buy the food and set up the decorations	ទៅទិញម្ហូប និងរៀបចំការតុបតែង
Ideas	Come up with a fun theme for the party	គិតរកប្រធានបទកម្សាន្តសម្រាប់កម្មវិធី

6. Part B3 — Deal-breakers
Instruction
- English: Tick anything you would really hate to do every day at work.
- Khmer: សូមជ្រើសរើសអ្វីដែលអ្នកពិតជាមិនចង់ធ្វើរៀងរាល់ថ្ងៃនៅកន្លែងធ្វើការ។
No.	English	Khmer
1	Sitting at a computer all day	អង្គុយមុខកុំព្យូទ័រពេញមួយថ្ងៃ
2	Seeing blood or injuries	ឃើញឈាម ឬរបួស
3	Lots of math	គណិតវិទ្យាច្រើន
4	Public speaking	និយាយនៅមុខសាធារណជន
5	Talking to strangers or customers	និយាយជាមួយមនុស្សមិនស្គាល់ ឬអតិថិជន
6	Working outside in the heat	ធ្វើការនៅខាងក្រៅក្រោមកម្តៅថ្ងៃ
7	Night shifts or weekends	ធ្វើការវេនយប់ ឬចុងសប្តាហ៍
8	Lots of reading and memorizing	អាន និងទន្ទេញច្រើន

Optional: students may leave this section empty.
7. Part C — Personality questionnaire
The existing design gives students two ways to answer:
1. Enter a four-letter personality type they already know.
2. Take the existing 12-question A/B quiz.
Personality introduction
- English: Have you taken a personality test that gave you a 4-letter type (like INTP or ESFJ)?
- Khmer: តើអ្នកធ្លាប់ធ្វើតេស្តបុគ្គលិកលក្ខណៈ ដែលផ្តល់ប្រភេទអក្សរ ៤ (ដូចជា INTP ឬ ESFJ) ដែរឬទេ?
Option	English	Khmer
1	Yes, I know my type	បាទ/ចាស ខ្ញុំដឹងពីបុគ្គលិកលក្ខណៈរបស់ខ្ញុំ
2	No / not sure	ទេ / មិនប្រាកដ

Other labels:
English	Khmer
Your 4-letter type	ប្រភេទអក្សរ ៤ របស់អ្នក
e.g. INTP	ឧ. INTP
I'd also like to take the short quiz	ខ្ញុំក៏ចង់ធ្វើកម្រងសំណួរខ្លីផងដែរ

The 12 existing personality questions
No.	Question (English)	សំណួរ (Khmer)	A	B
1	After a long school week, the best way to recharge is…	ក្រោយពីរៀនហត់មួយសប្តាហ៍ វិធីល្អបំផុតដើម្បីបន្ធូរអារម្មណ៍គឺ…	Going out with a group of friends / ចេញដើរលេងជាមួយក្រុមមិត្តភក្តិ	A quiet evening at home with music, a phone or a book / ល្ងាចស្ងប់ស្ងាត់នៅផ្ទះ ជាមួយតន្ត្រី ទូរសព្ទ ឬសៀវភៅ
2	At a wedding where you only know a few people, you…	នៅពិធីមង្គលការដែលអ្នកស្គាល់មនុស្សតែពីរបីនាក់ អ្នក…	Stay mostly with the people you came with / នៅជាមួយតែអ្នកដែលមកជាមួយគ្នាភាគច្រើន	End up chatting with new people / បញ្ចប់ដោយការជជែកជាមួយមនុស្សថ្មីៗ
3	Your group needs someone to present the project. You…	ក្រុមរបស់អ្នកត្រូវការនរណាម្នាក់បង្ហាញគម្រោង។ អ្នក…	Volunteer to present / ស្ម័គ្រចិត្តបង្ហាញ	Prefer to prepare the slides and let someone else speak / ចូលចិត្តរៀបចំស្លាយ ហើយឱ្យអ្នកផ្សេងនិយាយ
4	A teacher starts a new topic. You'd rather get…	គ្រូចាប់ផ្តើមមេរៀនថ្មី។ អ្នកចង់បាន…	Step-by-step examples first / ឧទាហរណ៍មួយជំហានម្តងៗជាមុនសិន	The big idea first, then examples / គំនិតធំជាមុនសិន ទើបឧទាហរណ៍
5	After a movie, you mostly talk about…	ក្រោយមើលកុនចប់ អ្នកភាគច្រើននិយាយអំពី…	What it meant and what could happen next / អត្ថន័យរបស់វា និងអ្វីដែលអាចកើតឡើងបន្ទាប់	The best scenes, places and characters / ឈុតឆាក ទីកន្លែង និងតួអង្គដែលល្អបំផុត
6	You get a new phone. You…	អ្នកទទួលបានទូរសព្ទថ្មី។ អ្នក…	Set up what you need and start using it / រៀបចំតែអ្វីដែលត្រូវការ ហើយចាប់ផ្តើមប្រើភ្លាម	Explore every setting and try strange features / រុករកការកំណត់គ្រប់យ៉ាង និងសាកមុខងារថ្មី
7	A friend shows you a song they made, and it's not very good. You…	មិត្តភក្តិបង្ហាញបទចម្រៀងដែលគេនិពន្ធ ប៉ុន្តែវាមិនសូវល្អ។ អ្នក…	Tell them honestly what to fix / ប្រាប់គេដោយស្មោះត្រង់ថាត្រូវកែអ្វីខ្លះ	Say what you liked first and keep criticism gentle / ប្រាប់ពីចំណុចដែលអ្នកចូលចិត្តជាមុន ហើយរិះគន់ដោយសមរម្យ
8	The class must choose between two trip locations. You vote for…	ថ្នាក់ត្រូវជ្រើសរើសទីកន្លែងដើរលេងមួយក្នុងចំណោមពីរ។ អ្នកបោះឆ្នោតឱ្យ…	The one most classmates are excited about / កន្លែងដែលមិត្តរួមថ្នាក់ភាគច្រើនរំភើបចង់ទៅ	The cheaper, closer one that makes more sense / កន្លែងដែលថោក ជិត និងសមហេតុផលជាង
9	Two friends are arguing. You try to…	មិត្តភក្តិពីរនាក់កំពុងឈ្លោះគ្នា។ អ្នកព្យាយាម…	Work out who is right / រកមើលថាអ្នកណាត្រូវ	Help them calm down and make up / ជួយឱ្យពួកគេស្ងប់ចិត្ត និងផ្សះផ្សាគ្នា
10	Your exam is in two weeks. You…	ការប្រឡងរបស់អ្នកនៅសល់ពីរសប្តាហ៍ទៀត។ អ្នក…	Make a study plan now / រៀបចំផែនការរៀនឥឡូវនេះ	Study when you feel ready, usually closer to the date / រៀននៅពេលមានអារម្មណ៍ថាត្រៀមខ្លួនរួច ជាធម្មតាជិតដល់ថ្ងៃប្រឡង
11	On a weekend trip with friends, you like…	ពេលដើរលេងចុងសប្តាហ៍ជាមួយមិត្តភក្តិ អ្នកចូលចិត្ត…	Deciding what to do as you go / សម្រេចចិត្តថាធ្វើអ្វីតាមដំណើរ	Knowing the plan and times ahead / ដឹងផែនការ និងពេលវេលាជាមុន
12	Your school bag right now is…	កាតាបរបស់អ្នកនៅពេលនេះ…	Organized; you know where everything is / មានរបៀបរៀបរយ ហើយអ្នកដឹងថារបស់នីមួយៗនៅឯណា	A bit messy, but you find things eventually / រញ៉េរញ៉ៃបន្តិច ប៉ុន្តែទីបំផុតក៏រកឃើញដែរ

Four personality dimensions
Dimension	First side	Second side
Social energy	outgoing — ចូលចិត្តជួបមនុស្ស	reserved — ចូលចិត្តភាពស្ងប់ស្ងាត់
Big-picture / practical	big-picture — មើលរូបភាពធំ	practical — ផ្តោតលើការអនុវត្ត
Heart-first / head-first	heart-first — ប្រើចិត្តមុន	head-first — ប្រើហេតុផលមុន
Planning	planner — ចូលចិត្តរៀបផែនការ	flexible — បត់បែន

Personality quiz response scale
Score	English
1	Definitely A
2	Probably A
3	Probably B
4	Definitely B

The existing source does not provide Khmer wording for these four response-scale labels. Mark them [NEEDS KHMER].
8. Part D1 — School results
Question
- English: What grade did you usually get in Grade 11–12 (or BacII)?
- Khmer: តើជាធម្មតាអ្នកទទួលបាននិទ្ទេសអ្វីនៅថ្នាក់ទី ១១–១២ (ឬបាក់ឌុប)?
Subjects
English	Khmer
Mathematics	គណិតវិទ្យា
Physics	រូបវិទ្យា
Chemistry	គីមីវិទ្យា
Biology	ជីវវិទ្យា
Khmer Literature	អក្សរសាស្ត្រខ្មែរ
English	ភាសាអង់គ្លេស
ICT / Computer	ICT / កុំព្យូទ័រ

Grade options
Option	Meaning
A	A
B	B
C	C
D	D
E/F	E/F
Didn't study	មិនបានរៀន

High-school track
- English: Your high-school track
- Khmer: ផ្នែកសិក្សានៅវិទ្យាល័យ
English	Khmer
Science	វិទ្យាសាស្ត្រ
Social Science	វិទ្យាសាស្ត្រសង្គម

9. Part D2 — Self-assessed skills
Question
- English: Compared with your classmates, how good are you at…
- Khmer: បើប្រៀបធៀបនឹងមិត្តរួមថ្នាក់ តើអ្នកពូកែកម្រិតណាក្នុង…
No.	English	Khmer
1	Math and working with numbers	គណិតវិទ្យា និងការងារជាមួយលេខ
2	Solving logic problems step by step	ដោះស្រាយបញ្ហាតក្កវិជ្ជាមួយជំហានម្តងៗ
3	Reading and writing in Khmer	ការអាន និងសរសេរភាសាខ្មែរ
4	Speaking and writing English	ការនិយាយ និងសរសេរភាសាអង់គ្លេស
5	Drawing, design and making things look good	គូររូប រចនា និងធ្វើឱ្យអ្វីៗមើលទៅស្អាត
6	Using tools and fixing things with your hands	ប្រើឧបករណ៍ និងជួសជុលរបស់របរដោយដៃ
7	Talking to people and persuading them	និយាយជាមួយមនុស្ស និងបញ្ចុះបញ្ចូលពួកគេ
8	Staying organized and catching small mistakes	រៀបចំអ្វីៗឱ្យមានរបៀប និងរកឃើញកំហុសតូចៗ
9	Using computers, apps and learning new software	ប្រើកុំព្យូទ័រ កម្មវិធី និងរៀនកម្មវិធីថ្មីៗ

Self-rating scale
Score	English	Khmer
1	Much weaker	ខ្សោយជាងច្រើន
2	Weaker	ខ្សោយជាង
3	Average	មធ្យម
4	Better	ល្អជាង
5	Much better	ល្អជាងច្រើន

10. Interest Fit — finalized formula from the existing code
Interest Fit combines the 30 RIASEC activities, the two quick preference questions, and the deal-breaker answers.
Step 1: Calculate the average for each RIASEC type
There are five activities for each type:
- R = Realistic
- I = Investigative
- A = Artistic
- S = Social
- E = Enterprising
- C = Conventional
For each type:
\[
\text{Average}_T =
\frac{\text{Sum of the five activity ratings}}{5}
\]

Each activity is rated from 1 to 5.
Step 2: Normalize each RIASEC average
\[
T=\frac{\text{Average}_T-1}{4}
\]

This converts the interest average to a value between 0 and 1.
Step 3: Calculate the major's RIASEC match
Each major has a two-letter or three-letter RIASEC code.

For a three-letter code, such as I-C-R:
\[
R=100\times\frac{3I+2C+1R}{6}
\]

For a two-letter code, such as R-I:
\[
R=100\times\frac{3R+2I}{5}
\]

The first letter receives the highest weight, the second receives the next-highest weight, and the third receives the lowest weight.
Step 4: Calculate the quick-preference score
Quick preference 1 — Free Saturday
- First RIASEC type in the major's code: 100 points.
- Second or third RIASEC type: 50 points.
- No match: 0 points.
Quick preference 2 — Class party task
- If the selected preference matches the major's work focus: 100 points.
- If it does not match: 0 points.
If both questions are answered:
\[
P=\frac{\text{Preference 1 score}+\text{Preference 2 score}}{2}
\]

If only one is answered, use that available preference score.

If neither is answered:
\[
P=R
\]

Step 5: Apply the deal-breaker penalty
Count how many selected deal-breakers are associated with that major.

Let \(k\) be the number of matching deal-breakers, with a maximum of 2.
\[
k=\min(2,\text{number of matching deal-breakers})
\]

The final Interest Fit is:
\[
\boxed{\text{Interest Fit}=(0.8R+0.2P)\times(1-0.15k)}
\]

This means each matching deal-breaker reduces the interest score by 15%, up to a maximum reduction of 30%.

11. Strength Fit — finalized formula from the existing code
Strength Fit uses two sources of evidence:
1. School grades.
2. Self-assessed skills.
Step 1: Convert school grades into scores
Grade	Score
A	100
B	80
C	60
D	40
E/F	20
Didn't study	Not included

Step 2: Convert self-ratings into scores
Self-ratings are from 1 to 5.
\[
\text{Self Skill Score}=
\frac{\text{Rating}-1}{4}\times100
\]

Rating	Score
1	0
2	25
3	50
4	75
5	100

Step 3: Combine grade evidence and self-rating
When both sources are available:
\[
\boxed{\text{Skill Score}=0.6(\text{Grade Score})+0.4(\text{Self Score})}
\]

When only one source is available, use that available score.

When neither source is available, the skill score is null.
Step 4: Map school subjects and self-assessed skills
This is the existing mapping in the code:
Major skill	School subject evidence	Self-assessed skill
Math	Mathematics	Math and working with numbers
Logic	Mathematics, Physics	Solving logic problems step by step
Khmer	Khmer Literature	Reading and writing in Khmer
English	English	Speaking and writing English
Design	None	Drawing, design and making things look good
Hands-on	None	Using tools and fixing things with your hands
People	None	Talking to people and persuading them
Organization	None	Staying organized and catching small mistakes
Computer	ICT / Computer	Using computers, apps and learning new software
Science	Biology, Chemistry	No direct self-rating mapping

Step 5: Calculate a major's Strength Fit
Each major has its own required skill list.

For example, Data Science uses:
- Math
- Logic
- Computer
The major's Strength Fit is the average of its available skill scores:
\[
\boxed{\text{Strength Fit}=
\frac{\text{Sum of available major skill scores}}
{\text{Number of available major skill scores}}}
\]

If no relevant skill evidence is available for a major:
\[
\text{Strength Fit}=\text{null}
\]

A missing score is not treated as zero.

12. The 16 major profiles
The following are the existing major profiles, including their RIASEC codes, work-focus targets, strength targets, and personality targets.

Personality target notation: H = 75, L = 25, and - means that the dimension is not used for that major. The order is Social energy, Big-picture, Heart-first, Planner.
ID	Major	Khmer	RIASEC	Work focus	Strength targets	Personality
ds	Data Science	វិទ្យាសាស្ត្រទិន្នន័យ	I-C-R	Data, Ideas	Math, Logic, Computer	LH-H
it	IT / Software Engineering	ព័ត៌មានវិទ្យា / វិស្វកម្មកម្មវិធី	I-R-C	Ideas, Things	Logic, Computer, Math	LH--
cy	Cybersecurity / Networking	សន្តិសុខអ៊ីនធឺណិត / បណ្តាញ	I-R-C	Things, Data	Logic, Computer, Organization	L--H
ee	Electrical & Electronic Engineering	វិស្វកម្មអគ្គិសនី និងអេឡិចត្រូនិច	R-I	Things, Ideas	Math, Hands-on, Logic	L-L-
ce	Civil Engineering	វិស្វកម្មសំណង់ស៊ីវិល	R-I-C	Things, Data	Math, Hands-on, Logic	-L-H
ar	Architecture	ស្ថាបត្យកម្ម	A-R-I	Ideas, Things	Design, Math, Hands-on	-H--
md	Medicine / Dentistry	វេជ្ជសាស្ត្រ / ទន្តសាស្ត្រ	I-S-R	Ideas, People	Science, Logic, Organization	---H
nu	Nursing / Physiotherapy	គិលានុបដ្ឋាក / ព្យាបាលដោយចលនា	S-I-R	People, Things	Science, People, Hands-on	HLHH
ac	Accounting	គណនេយ្យ	C-E-I	Data	Math, Organization, Computer	LL-H
fi	Finance & Banking	ហិរញ្ញវត្ថុ និងធនាគារ	C-E-I	Data, People	Math, Logic, English	--LH
mk	Marketing / Business Admin	ទីផ្សារ / គ្រប់គ្រងពាណិជ្ជកម្ម	E-A-S	People, Ideas	People, English, Design	HH--
hr	Human Resource Management	គ្រប់គ្រងធនធានមនុស្ស	S-E-C	People, Data	People, Organization, Khmer	H-HH
lw	Law	នីតិសាស្ត្រ	E-I-S	People, Ideas	Khmer, Logic, People	H-LH
gd	Graphic Design / Multimedia	រចនាក្រាហ្វិក / ពហុព័ត៌មាន	A-E-R	Ideas, Things	Design, Computer	-H-L
ho	Hospitality & Tourism	បដិសណ្ឋារកិច្ច និងទេសចរណ៍	E-S-C	People, Data	People, English, Organization	HLH-
ed	Education / TESOL	អប់រំ / បង្រៀនភាសាអង់គ្លេស (TESOL)	S-A-I	People, Ideas	English, People, Khmer	H-H-

Note on major descriptions: the uploaded source contains the major names, Khmer names, RIASEC codes, work focus, strength targets, admission guidance and personality targets. It does not contain a full description paragraph for each major. I have therefore kept this table to the fields that are actually defined.
13. Personality Fit formula
Each major has a target for some or all of the four personality dimensions.
- H target = 75.
- L target = 25.
- - = ignore that dimension.
For each dimension that the major uses:
\[
\text{Dimension Fit}=100-|\text{Student Score}-\text{Major Target}|
\]

Then:
\[
\boxed{\text{Personality Fit}=
\text{Average of all applicable Dimension Fits}}
\]

If personality information is unavailable, Personality Fit is null.
How the personality quiz scores are calculated
For the 12-question quiz, the four answer levels are converted as follows:
Response	Score toward A
Definitely A	100
Probably A	67
Probably B	33
Definitely B	0

If the question's scoring direction points toward B, the score is reversed:
\[
\text{B score}=100-\text{A score}
\]

The quiz averages the three questions in each personality dimension. If fewer than three answers are available in any dimension, the quiz personality result is unavailable.

If the student enters a valid four-letter type, the existing code maps its letters to the four dimensions using 80 and 20. If both the type and quiz are completed, the code averages the two results for each dimension.
14. Overall Major Match formula
The existing overall weights are:
Component	Weight
Job Fit	25%
Interest Fit	30%
Personality Fit	20%
Strength Fit	25%
Total	100%

The calculation is:
\[
\text{Overall}=
\frac{
0.25J+0.30I+0.20P+0.25S
}{
0.25+0.30+0.20+0.25
}
\]

Where:
- \(J\) = Job Fit
- \(I\) = Interest Fit
- \(P\) = Personality Fit
- \(S\) = Strength Fit
Missing evidence rule
If a component is unavailable (null), it is excluded from both the numerator and denominator.

For example, if a student does not know their dream job and does not select a field, Job Fit is unavailable. The remaining weights add up to 75%.
\[
\text{Overall}=
\frac{0.30I+0.20P+0.25S}{0.75}
\]

If Strength Fit is unavailable:
\[
\text{Overall}=
\frac{0.25J+0.30I+0.20P}{0.75}
\]

If both Job Fit and Strength Fit are unavailable:
\[
\text{Overall}=
\frac{0.30I+0.20P}{0.50}
\]

Important rules:
1. Missing evidence is null, not zero.
2. Do not penalize a student simply because they do not know their dream job.
3. Do not treat an unreported grade or skill as a zero.
4. Only use available component scores and their corresponding weights.
5. If there is no usable evidence for a result, display Not enough info / ព័ត៌មានមិនគ្រប់ instead of presenting a misleading score.
The current scoring function already excludes null components and renormalizes the weights. However, it does not explicitly guard against the special case where every component is unavailable. That case should display the not-enough-evidence message rather than calculate a score.
15. Major-to-field mapping used by Job Fit
This is the existing mapping that determines which majors belong to each field:
Field	Major IDs	Majors
Science & research	ds, md, nu	Data Science, Medicine / Dentistry, Nursing / Physiotherapy
Technology	ds, it, cy	Data Science, IT / Software Engineering, Cybersecurity / Networking
Engineering & building	ee, ce, ar	Electrical & Electronic Engineering, Civil Engineering, Architecture
Health & care	md, nu	Medicine / Dentistry, Nursing / Physiotherapy
Business & money	ac, fi, mk, hr	Accounting, Finance & Banking, Marketing / Business Admin, Human Resource Management
Creative & design	gd, ar, mk	Graphic Design / Multimedia, Architecture, Marketing / Business Admin
People & service	ed, ho, lw, hr	Education / TESOL, Hospitality & Tourism, Law, Human Resource Management

This mapping is important because Job Fit compares the student's chosen dream job or field against these major IDs.
16. Final implementation reference
The complete student-facing assessment should follow this order:
1. Dream job or field — one specific dream job OR one field if unsure.
2. B1 — 30 everyday activities, with the five-point interest scale.
3. B2 — two quick preference questions.
4. B3 — eight optional deal-breakers.
5. Personality — the existing personality-type option or the existing 12-question quiz.
6. D1 — seven school subjects and high-school track.
7. D2 — nine self-assessed skills.
The following details are worth keeping visible when implementing:
- The uploaded source has Khmer translations for the questions and options listed above.
- The four personality response-scale labels still need Khmer wording.
- The current field prompt in the code says “Pick 1 or 2”; your clarified design is one field only.
- The existing career catalogue allows one selected dream job, with an option to type a custom job.
- The source's configuration declares FORMULA_VERSION: "2.1", while its scoring-section comment says “formula 2.0.” I am preserving both as they appear in the file rather than renaming the formula or assuming a different version.
This is the questionnaire and scoring reference from the existing work, with your one-job-or-one-field clarification stated explicitly.
