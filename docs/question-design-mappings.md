1. Deal-breaker → major mapping
The code applies a 15% penalty for each matching deal-breaker, up to two penalties (maximum 30%).
Deal-breaker	Khmer	Majors affected
Sitting at a computer all day	អង្គុយមុខកុំព្យូទ័រពេញមួយថ្ងៃ	Data Science, IT / Software Engineering, Cybersecurity / Networking, Accounting
Seeing blood or injuries	ឃើញឈាម ឬរបួស	Medicine / Dentistry, Nursing / Physiotherapy
Lots of math	គណិតវិទ្យាច្រើន	Electrical & Electronic Engineering, Civil Engineering, Data Science, Finance & Banking
Public speaking	និយាយនៅមុខសាធារណជន	Law, Education / TESOL, Marketing / Business Admin
Talking to strangers or customers	និយាយជាមួយមនុស្សមិនស្គាល់ ឬអតិថិជន	Marketing / Business Admin, Hospitality & Tourism
Working outside in the heat	ធ្វើការនៅខាងក្រៅក្រោមកម្តៅថ្ងៃ	Civil Engineering
Night shifts or weekends	ធ្វើការវេនយប់ ឬចុងសប្តាហ៍	Medicine / Dentistry, Hospitality & Tourism
Lots of reading and memorizing	អាន និងទន្ទេញច្រើន	Law, Medicine / Dentistry

Exact scoring rule:
\[
k=\min(2,\text{number of selected matching deal-breakers})
\]

\[
\text{Interest Fit}=(0.8R+0.2P)\times(1-0.15k)
\]

For example, if a student selects both “Lots of math” and “Sitting at a computer all day”, Data Science has two matching deal-breakers, so its interest score receives a 30% reduction.
2. Dream job → major mapping
The existing code uses two levels:
- 100 points: the selected job directly lists that major ID.
- 50 points: the major is another major within the job's category field.
- 0 points: neither condition matches.
For example, if a student chooses Data Analyst:
- Data Science: 100 (directly linked).
- IT / Software Engineering: 100 (also directly linked).
- Cybersecurity / Networking: 50 (same Technology field).
- Civil Engineering: 0 (different field).
Category-to-field mapping
Yes, the current code maps job categories to the corresponding field IDs as follows:
Job category (cat)	Field used by Job Fit	Field's Khmer
tech	Technology	បច្ចេកវិទ្យា
eng	Engineering & building	វិស្វកម្ម និងសំណង់
health	Health & care	សុខាភិបាល និងការថែទាំ
biz	Business & money	ពាណិជ្ជកម្ម និងហិរញ្ញវត្ថុ
creative	Creative & design	ច្នៃប្រឌិត និងរចនា
people	People & service	មនុស្ស និងសេវាកម្ម

Science & research has no corresponding job category. It is a separate field that undecided students can select. So yes, no career in the current catalogue has cat: "science".
Direct job-to-major links in the existing career catalogue
The lists below show which major IDs receive 100 points for each job. Other majors in that job's category field receive 50 points, unless they are already directly linked.

Major ID reference:
ID	Major
ds	Data Science
it	IT / Software Engineering
cy	Cybersecurity / Networking
ee	Electrical & Electronic Engineering
ce	Civil Engineering
ar	Architecture
md	Medicine / Dentistry
nu	Nursing / Physiotherapy
ac	Accounting
fi	Finance & Banking
mk	Marketing / Business Admin
hr	Human Resource Management
lw	Law
gd	Graphic Design / Multimedia
ho	Hospitality & Tourism
ed	Education / TESOL

Technology jobs
Job	Direct major IDs
Web technician	it
ICT operations technician	it, cy
Applications programmer	it, ds
Software developer	it
Systems analyst	ds, it
Computer network professional	cy
IT trainer	ed, it
Data analyst	ds, it
Data scientist	ds, it
Data engineer	ds, it
Business intelligence analyst	ds, it
Statistician	ds
Machine learning engineer	ds, it
AI specialist	ds, it
Database administrator	it, ds
Software quality assurance tester	it
DevOps engineer	it
Cloud engineer	it
Cybersecurity analyst	cy, it
Digital forensics specialist	cy, it
IT project manager	it
IT support specialist	it
GIS specialist	ds, it

Engineering jobs
Job	Direct major IDs
Telecommunications engineer	ee
Electronics engineer	ee
Civil engineer	ce
Surveyor	ce
Mechanical engineer	me*
Chemical engineer	ch*
Industrial engineer	me*
Environmental engineer	ce
Water resources engineer	ce
Transportation engineer	ce
Structural engineer	ce
Electrical power engineer	ee
Renewable energy engineer	ee
Automotive technician	me*
BIM technician	ce
Quantity surveyor	ce
Occupational safety officer	ce
Electrician	ee
Plumber	ce
Welder	me*
Machinist	me*
Refrigeration and air conditioning technician	ee
Quality control inspector	ch*
Construction supervisor	ce
Aircraft maintenance technician	me*, ee

Health jobs
Job	Direct major IDs
Doctor or dentist	md
Nurse or physiotherapist	nu
Pharmacist	ph*
Midwife	nu
Medical laboratory scientist	md
Radiographer	md
Public health officer	md, nu
Nutritionist	md, nu
Psychologist	md
Counselor	nu
Veterinarian	md
Emergency medical technician	nu
Health information officer	ds, it

Business jobs
Job	Direct major IDs
Accountant or auditor	ac
Financial adviser	fi
Finance manager	fi, ac
Sales & marketing manager	mk
HR specialist or manager	hr
Banking officer	fi
Risk analyst	fi, ds
Actuary	fi, ac
Insurance officer	fi
Tax consultant	ac
Internal auditor	ac
Procurement officer	ac
Supply chain analyst	ds
Logistics coordinator	ac
Project coordinator	hr
Operations manager	hr
Entrepreneur	mk
Management consultant	hr
Compliance officer	ac
Administrative officer	hr
Customs officer	ac
Real estate agent	mk
E-commerce specialist	mk, it
Warehouse supervisor	ac
Customer service representative	hr, mk

Creative jobs
Job	Direct major IDs
Architect / landscape architect	ar
Graphic & multimedia designer	gd
Web & multimedia developer	it, gd
Advertising & PR manager	mk
UX/UI designer	gd, it
Digital marketing specialist	mk
Content writer	mk
Journalist	mk
Photographer	gd
Video editor	gd
Animator	gd, it
Translator or interpreter	mk
Communications officer	mk
Brand manager	mk
Event planner	ho, mk

People & service jobs
Job	Direct major IDs
Lawyer	lw
Hotel or restaurant manager	ho
Chef	ho
Teacher or lecturer	ed
Early childhood educator	ed
Vocational trainer	ed
Curriculum developer	ed
Librarian	ed
Social worker	ed
NGO program officer	hr
Monitoring and evaluation officer	ds
Policy analyst	ds
Diplomat	hr
Paralegal or legal assistant	lw
Tour guide	ho
Hotel operations officer	ho
Hotel front desk officer	ho
Travel consultant	ho
Pastry chef or baker	ho
Flight attendant	ho
Civil servant	hr
Police officer	lw
Firefighter	ed
Humanitarian aid worker	hr

Important source detail: me, ch and ph are used in the job catalogue, but they are not IDs in the current 16-major list. Therefore, those jobs do not directly give 100 points to any of the 16 current majors. The Job Fit function can still award 50 points to majors in the same field. I have preserved this as written rather than silently remapping those IDs.
3. Khmer for the four personality quiz answer labels
These are already translated in the existing STR object. No translation is needed.
English	Existing Khmer
Definitely A	A ច្បាស់
Probably A	ប្រហែល A
Probably B	ប្រហែល B
Definitely B	B ច្បាស់

4. Important source-code finding
There are three legacy major IDs in the career catalogue:
- me — Mechanical Engineering
- ch — Chemical Engineering
- ph — Pharmacy
They are not among the current 16 majors. This means some jobs have no direct 100-point match in the current major list. I have left them unchanged in this extraction because you asked me to follow the existing code.
