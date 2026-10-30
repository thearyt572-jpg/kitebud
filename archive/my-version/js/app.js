// app.js — page behaviour, navigation, screens
//
// Uses data and functions from the files loaded before this one:
//   QUESTIONS            (questions.js)
//   MAJORS, SAMPLE_RESULTS (majors.js)
//   MAJOR_DETAILS, UNIVERSITY_PROGRAMS (universities.js)
//   calculateResults()   (scoring.js)


// =========================================================
// 1. Settings
// =========================================================

// The name we save progress under in localStorage
const STORAGE_KEY = "kitebud-state-v1";

// Which result ranks each package unlocks.
// "demo" unlocks none of the student's own results — it shows SAMPLE_RESULTS instead.
const PACKAGES = {
  demo: { name: "សាកល្បងឥតគិតថ្លៃ", price: "ឥតគិតថ្លៃ", unlockedRanks: [] },
  A: { name: "កញ្ចប់ A", price: "$1.00", unlockedRanks: [3] },
  B: { name: "កញ្ចប់ B", price: "$2.50", unlockedRanks: [1, 2, 3] }
};

const BREAKDOWN_LABELS = {
  job: "ការងារ",
  interest: "ចំណាប់អារម្មណ៍",
  personality: "បុគ្គលិកលក្ខណៈ",
  strength: "ចំណុចខ្លាំង"
};

// The 4 buttons for "pair4" questions (ក = side A, ខ = side B)
// &nbsp; = a space that never breaks onto a new line
const PAIR4_CHOICES = [
  { value: "A2", label: "ប្រាកដជា&nbsp;ក" },
  { value: "A1", label: "ប្រហែលជា&nbsp;ក" },
  { value: "B1", label: "ប្រហែលជា&nbsp;ខ" },
  { value: "B2", label: "ប្រាកដជា&nbsp;ខ" }
];

// --- University listings ---

// Shown beside every tuition figure and every scholarship deadline
const INFO_WARNING = "ព័ត៌មានអាចផ្លាស់ប្តូរ — សូមពិនិត្យគេហទំព័រផ្លូវការ";
const NOT_AVAILABLE = "ព័ត៌មានមិនទាន់មាននៅឡើយ";

const TUITION_PERIOD_LABELS = {
  semester: "ក្នុងមួយឆមាស",
  year: "ក្នុងមួយឆ្នាំ",
  total: "សរុបសម្រាប់កម្មវិធីទាំងមូល",
  other: "រយៈពេលផ្សេងទៀត (សូមមើលកំណត់ចំណាំ)"
};

// The budget filter only compares tuition in this currency
const FILTER_CURRENCY = "USD";

// SAMPLE rows are hidden unless the address ends with ?samples=1 (for testing only)
const SHOW_SAMPLE_DATA = new URLSearchParams(window.location.search).has("samples");

// Current filter choices (not saved — they reset when the page reloads)
const universityFilters = {
  city: "",
  maxTuition: null,
  period: "year",
  scholarshipOnly: false
};


// =========================================================
// 2. Elements on the page
// =========================================================

const navLinks = document.querySelectorAll(".nav ul a");
const pricingCards = document.querySelectorAll(".pricing-card[data-package]");
const packageStatus = document.getElementById("package-status");

const assessmentPanel = document.querySelector(".assessment-panel");
const progressPart = document.getElementById("progress-part");
const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress-bar");
const progressFill = document.getElementById("progress-fill");
const questionArea = document.getElementById("question-area");
const questionNavigation = document.getElementById("question-navigation");
const backButton = document.getElementById("back-button");
const nextButton = document.getElementById("next-button");
const restartButton = document.getElementById("restart-button");

const resultsSection = document.getElementById("results");
const resultsHeading = document.getElementById("results-heading");
const resultsContent = document.getElementById("results-content");

const filterPanel = document.getElementById("university-filters");
const filterCity = document.getElementById("filter-city");
const filterMaxTuition = document.getElementById("filter-max-tuition");
const filterPeriod = document.getElementById("filter-period");
const filterScholarship = document.getElementById("filter-scholarship");
const filterClear = document.getElementById("filter-clear");


// =========================================================
// 3. State (everything we need to remember) + localStorage
// =========================================================

// state = {
//   order:    question ids in the order this student sees them
//   current:  index of the question on screen (0 = first)
//   answers:  { questionId: answer }
//   finished: true after the last question
//   package:  null | "demo" | "A" | "B"
// }
let state = loadState();

function createFreshState() {
  return {
    order: buildQuestionOrder(),
    current: 0,
    answers: {},
    finished: false,
    package: null
  };
}

function loadState() {
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch (error) {
    saved = null; // storage blocked or broken data → start fresh
  }

  // Saved progress is only usable if it matches the current question list
  // (after you change questions.js, old progress is thrown away).
  if (saved && isSavedOrderValid(saved.order)) {
    saved.answers = saved.answers || {};
    saved.current = Math.min(Math.max(saved.current || 0, 0), saved.order.length - 1);
    saved.finished = Boolean(saved.finished);
    saved.package = PACKAGES[saved.package] ? saved.package : null;
    return saved;
  }

  const fresh = createFreshState();
  if (saved && PACKAGES[saved.package]) {
    fresh.package = saved.package; // keep the chosen package
  }
  return fresh;
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    // Storage not available (e.g. private mode) — the app still works, it just won't remember.
  }
}

function isSavedOrderValid(order) {
  return Array.isArray(order) &&
    order.length === QUESTIONS.length &&
    QUESTIONS.every(question => order.includes(question.id));
}


// =========================================================
// 4. Question order (shuffle inside each part)
// =========================================================

function buildQuestionOrder() {
  // List the parts in the order they first appear
  const parts = [];
  QUESTIONS.forEach(question => {
    if (!parts.includes(question.part)) {
      parts.push(question.part);
    }
  });

  // Inside each part, questions with shuffle: true swap places with each other.
  // Questions without shuffle stay exactly where they are.
  const order = [];
  parts.forEach(part => {
    const inPart = QUESTIONS.filter(question => question.part === part);
    const shuffled = shuffleArray(inPart.filter(question => question.shuffle));
    inPart.forEach(question => {
      order.push(question.shuffle ? shuffled.shift().id : question.id);
    });
  });
  return order;
}

// Fisher–Yates shuffle: returns a new, randomly ordered copy of the array
function shuffleArray(array) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

function getQuestion(id) {
  return QUESTIONS.find(question => question.id === id);
}

function currentQuestion() {
  return getQuestion(state.order[state.current]);
}


// =========================================================
// 5. Navigation: highlight the menu item for the section on screen
// =========================================================

function setActiveLink(sectionId) {
  navLinks.forEach(link => {
    const isActive = link.getAttribute("href") === "#" + sectionId;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

// IntersectionObserver tells us when a section crosses the middle of the screen
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setActiveLink(entry.target.id);
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });

document.querySelectorAll("main section[id]").forEach(section => {
  sectionObserver.observe(section);
});


// =========================================================
// 6. Package selection (demo only — no real payment)
// =========================================================

pricingCards.forEach(card => {
  const button = card.querySelector("button");
  button.dataset.label = button.textContent; // remember the original button text

  // Clicking anywhere on the card (including its button) selects it
  card.addEventListener("click", () => {
    selectPackage(card.dataset.package);
  });
});

function selectPackage(packageId) {
  state.package = packageId;
  saveState();
  renderPackages();
  renderResults();
}

function renderPackages() {
  pricingCards.forEach(card => {
    const button = card.querySelector("button");
    const isSelected = card.dataset.package === state.package;
    card.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", isSelected ? "true" : "false");
    button.textContent = isSelected ? "✓ បានជ្រើសរើស" : button.dataset.label;
  });

  if (!state.package) {
    packageStatus.textContent = "អ្នកមិនទាន់បានជ្រើសរើសកញ្ចប់ណាមួយនៅឡើយទេ។";
    return;
  }

  const chosen = PACKAGES[state.package];
  let message = `អ្នកបានជ្រើសរើស៖ <strong>${chosen.name}</strong> (${chosen.price})។ `;
  if (state.package !== "demo") {
    message += "នេះគ្រាន់តែជាការសាកល្បង មិនមានការកាត់ប្រាក់ពិតប្រាកដទេ។ ";
  }
  message += `<a href="#results">មើលលទ្ធផល</a>`;
  packageStatus.innerHTML = message;
}


// =========================================================
// 7. Assessment: show one question at a time
// =========================================================

function renderAssessment(moveFocus) {
  const total = state.order.length;

  // --- Finished screen ---
  if (state.finished) {
    progressPart.textContent = "";
    progressText.textContent = "បានបញ្ចប់";
    setProgress(total, total);
    questionNavigation.hidden = true;
    questionArea.innerHTML = `
      <div class="finished">
        <p class="question-text" tabindex="-1">
          <span aria-hidden="true">🎉</span> អ្នកបានឆ្លើយសំណួរទាំងអស់រួចរាល់ហើយ!
        </p>
        <p>សូមមើលលទ្ធផលរបស់អ្នកខាងក្រោម។</p>
        <button type="button" class="button button-secondary" id="review-button">កែប្រែចម្លើយ</button>
      </div>`;
    return;
  }

  // --- Question screen ---
  const question = currentQuestion();
  const number = state.current + 1;

  progressPart.textContent = `ផ្នែកទី ${question.part}`;
  progressText.textContent = `សំណួរទី ${number} / ${total}`;
  setProgress(number, total);
  questionNavigation.hidden = false;

  questionArea.innerHTML = buildQuestionHTML(question);
  restoreAnswer(question);
  updateHint(question);
  updateButtons(question);

  if (moveFocus) {
    // Move keyboard/screen-reader focus to the new question
    questionArea.querySelector(".question-text").focus({ preventScroll: true });
    // On phones, scroll back up if the top of the panel is off screen
    if (assessmentPanel.getBoundingClientRect().top < 0) {
      assessmentPanel.scrollIntoView({ block: "start" });
    }
  }
}

function setProgress(number, total) {
  progressFill.style.width = (number / total) * 100 + "%";
  progressBar.setAttribute("aria-valuenow", number);
  progressBar.setAttribute("aria-valuemax", total);
}

// Builds the HTML for one question.
// Only text, labels and values are used — the hidden "key" is never put on the page.
function buildQuestionHTML(question) {
  if (question.type === "grade" || question.type === "text-code") {
    let input;
    if (question.type === "grade") {
      input = `<input id="answer-input" class="text-input" type="number" inputmode="decimal"
        min="${question.min}" max="${question.max}" step="${question.step || "any"}"
        aria-describedby="question-hint">`;
    } else {
      input = `<input id="answer-input" class="text-input text-input-code" type="text"
        autocomplete="off" spellcheck="false"
        maxlength="${question.maxLength || 50}" placeholder="${question.placeholder || ""}"
        aria-describedby="question-hint">`;
    }
    return `
      <div class="question">
        <label class="question-text" for="answer-input" tabindex="-1">${question.text}</label>
        ${input}
        <p class="question-hint" id="question-hint" aria-live="polite"></p>
      </div>`;
  }

  let choicesHTML = "";

  if (question.type === "rating5") {
    const items = question.options.map(option =>
      choiceHTML("radio", option.value, `<b>${option.value}</b> <span>${option.label}</span>`)
    );
    choicesHTML = `<div class="choices choices-rating">${items.join("")}</div>`;
  }

  if (question.type === "single" || question.type === "multi") {
    const inputType = question.type === "single" ? "radio" : "checkbox";
    const items = question.options.map(option =>
      choiceHTML(inputType, option.value, `<span>${option.label}</span>`)
    );
    choicesHTML = `<div class="choices choices-list">${items.join("")}</div>`;
  }

  if (question.type === "pair4") {
    const items = PAIR4_CHOICES.map(choice =>
      choiceHTML("radio", choice.value, `<span>${choice.label}</span>`)
    );
    choicesHTML = `
      <div class="pair-sides">
        <p class="pair-side"><span class="pair-letter">ក</span> ${question.options.a}</p>
        <p class="pair-side"><span class="pair-letter">ខ</span> ${question.options.b}</p>
      </div>
      <div class="choices choices-pair">${items.join("")}</div>`;
  }

  return `
    <fieldset class="question">
      <legend class="question-text" tabindex="-1">${question.text}</legend>
      ${choicesHTML}
      <p class="question-hint" id="question-hint" aria-live="polite"></p>
    </fieldset>`;
}

function choiceHTML(inputType, value, labelHTML) {
  return `
    <label class="choice">
      <input type="${inputType}" name="answer" value="${value}">
      ${labelHTML}
    </label>`;
}

// Puts a saved answer back into the inputs (after Back, or after a page refresh)
function restoreAnswer(question) {
  const value = state.answers[question.id];
  if (value === undefined) {
    return;
  }
  if (question.type === "grade" || question.type === "text-code") {
    document.getElementById("answer-input").value = value;
    return;
  }
  const savedValues = (Array.isArray(value) ? value : [value]).map(String);
  questionArea.querySelectorAll("input[name='answer']").forEach(input => {
    input.checked = savedValues.includes(input.value);
  });
}

// Reads the answer from the inputs on screen
function readAnswer(question) {
  if (question.type === "grade") {
    const raw = document.getElementById("answer-input").value.trim();
    return raw === "" ? undefined : Number(raw);
  }
  if (question.type === "text-code") {
    let text = document.getElementById("answer-input").value.trim();
    if (question.uppercase) {
      text = text.toUpperCase();
    }
    return text === "" ? undefined : text;
  }

  const checkedInputs = questionArea.querySelectorAll("input[name='answer']:checked");
  const checkedValues = Array.from(checkedInputs).map(input => input.value);

  if (checkedValues.length === 0) {
    return undefined;
  }
  if (question.type === "multi") {
    return checkedValues;
  }
  if (question.type === "rating5") {
    return Number(checkedValues[0]);
  }
  return checkedValues[0]; // single, pair4
}

// Is this answer complete and valid? (decides if "Next" is enabled)
function isAnswered(question, value) {
  if (value === undefined || value === null) {
    return false;
  }

  if (question.type === "multi") {
    const min = question.min !== undefined ? question.min : 1;
    const max = question.max !== undefined ? question.max : Infinity;
    return Array.isArray(value) && value.length >= min && value.length <= max;
  }

  if (question.type === "grade") {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return false;
    }
    if (value < question.min || value > question.max) {
      return false;
    }
    if (question.step) {
      const steps = (value - (question.min || 0)) / question.step;
      return Math.abs(steps - Math.round(steps)) < 0.000001;
    }
    return true;
  }

  if (question.type === "text-code") {
    return new RegExp(question.validation.pattern).test(value);
  }

  return true; // rating5, single, pair4: any choice is fine
}

// The small help / error line under each question
function updateHint(question) {
  const hint = document.getElementById("question-hint");
  const value = state.answers[question.id];
  let text = "";
  let isError = false;

  if (question.type === "multi") {
    const count = Array.isArray(value) ? value.length : 0;
    text = `បានជ្រើសរើស ${count}`;
    if (question.min !== undefined && question.max !== undefined) {
      text += ` · សូមជ្រើសរើសពី ${question.min} ដល់ ${question.max}`;
    } else if (question.min !== undefined) {
      text += ` · យ៉ាងតិច ${question.min}`;
    } else if (question.max !== undefined) {
      text += ` · យ៉ាងច្រើន ${question.max}`;
    }
    // When the maximum is reached, the unchecked options are disabled
    questionArea.querySelectorAll("input[name='answer']").forEach(input => {
      input.disabled = question.max !== undefined && count >= question.max && !input.checked;
    });
  }

  if (question.type === "grade") {
    if (value === undefined) {
      text = `សូមបញ្ចូលលេខពី ${question.min} ដល់ ${question.max}`;
    } else if (!isAnswered(question, value)) {
      text = `លេខនេះមិនត្រឹមត្រូវទេ។ សូមបញ្ចូលលេខពី ${question.min} ដល់ ${question.max}`;
      isError = true;
    }
  }

  if (question.type === "text-code") {
    const stillTyping = question.maxLength && value !== undefined && value.length < question.maxLength;
    if (value === undefined || stillTyping) {
      text = question.validation.hint;
    } else if (isAnswered(question, value)) {
      text = "✓ ត្រឹមត្រូវ";
    } else {
      text = question.validation.message;
      isError = true;
    }
  }

  hint.textContent = text;
  hint.classList.toggle("is-error", isError);
  const input = document.getElementById("answer-input");
  if (input) {
    input.setAttribute("aria-invalid", isError ? "true" : "false");
  }
}

function updateButtons(question) {
  const isLast = state.current === state.order.length - 1;
  backButton.disabled = state.current === 0;
  nextButton.disabled = !isAnswered(question, state.answers[question.id]);
  nextButton.textContent = isLast ? "មើលលទ្ធផល" : "បន្ទាប់";
}

function handleAnswerChange() {
  const question = currentQuestion();
  const value = readAnswer(question);
  if (value === undefined) {
    delete state.answers[question.id];
  } else {
    state.answers[question.id] = value;
  }
  saveState();
  updateHint(question);
  updateButtons(question);
}


// --- Events for the assessment ---

// "input" fires while typing; "change" fires when a radio/checkbox is picked
questionArea.addEventListener("input", handleAnswerChange);
questionArea.addEventListener("change", handleAnswerChange);

// Pressing Enter in a text/number box works like clicking "Next"
questionArea.addEventListener("keydown", event => {
  if (event.key === "Enter" && event.target.matches(".text-input")) {
    event.preventDefault();
    nextButton.click();
  }
});

// "Edit answers" button on the finished screen
questionArea.addEventListener("click", event => {
  if (event.target.closest("#review-button")) {
    state.finished = false;
    state.current = state.order.length - 1;
    saveState();
    renderAssessment(true);
    renderResults();
  }
});

backButton.addEventListener("click", () => {
  if (state.current > 0) {
    state.current = state.current - 1;
    saveState();
    renderAssessment(true);
  }
});

nextButton.addEventListener("click", () => {
  const question = currentQuestion();
  if (!isAnswered(question, state.answers[question.id])) {
    return;
  }

  if (state.current === state.order.length - 1) {
    // Last question → finish and show results
    state.finished = true;
    saveState();
    renderAssessment(false);
    renderResults();
    resultsHeading.focus({ preventScroll: true });
    resultsSection.scrollIntoView({ block: "start" });
  } else {
    state.current = state.current + 1;
    saveState();
    renderAssessment(true);
  }
});

restartButton.addEventListener("click", () => {
  const hasAnswers = Object.keys(state.answers).length > 0;
  if (hasAnswers && !window.confirm("តើអ្នកចង់ចាប់ផ្តើមម្តងទៀតមែនទេ? ចម្លើយទាំងអស់របស់អ្នកនឹងត្រូវលុបចោល។")) {
    return;
  }
  const chosenPackage = state.package;
  state = createFreshState(); // new empty answers + a new shuffle
  state.package = chosenPackage;
  saveState();
  renderAssessment(true);
  renderResults();
});


// =========================================================
// 8. Results
// =========================================================

function renderResults() {
  // University filters only make sense when the student's own results are unlocked
  filterPanel.hidden = !(state.finished && (state.package === "A" || state.package === "B"));

  // Free Demo → fictional sample results, all visible
  if (state.package === "demo") {
    resultsContent.innerHTML =
      `<p class="results-note">នេះជាលទ្ធផលគំរូដែលប្រើទិន្នន័យប្រឌិត មិនមែនជាលទ្ធផលផ្ទាល់ខ្លួនរបស់អ្នកទេ។</p>` +
      topThree(SAMPLE_RESULTS).map((result, index) => resultCardHTML(result, index + 1, true)).join("");
    return;
  }

  // Not finished yet
  if (!state.finished) {
    resultsContent.innerHTML =
      `<p class="placeholder">សូមបញ្ចប់ការវាយតម្លៃខាងលើជាមុនសិន ដើម្បីមើលលទ្ធផលរបស់អ្នក។</p>`;
    return;
  }

  // Finished → the student's own results, locked/unlocked by package
  const results = topThree(calculateResults(state.answers));
  const unlockedRanks = state.package ? PACKAGES[state.package].unlockedRanks : [];

  let note = "";
  if (!state.package) {
    note = `<p class="results-note">លទ្ធផលរបស់អ្នករួចរាល់ហើយ! សូម<a href="#pricing">ជ្រើសរើសកញ្ចប់</a> ដើម្បីដោះសោឈ្មោះជំនាញ និងព័ត៌មានលម្អិត។</p>`;
  } else if (state.package === "A") {
    note = `<p class="results-note">កញ្ចប់ A ដោះសោជំនាញលំដាប់ទី៣។ ដើម្បីមើលទាំងបី សូមជ្រើសរើស<a href="#pricing">កញ្ចប់ B</a>។</p>`;
  }

  resultsContent.innerHTML = note + results.map((result, index) => {
    const rank = index + 1;
    return resultCardHTML(result, rank, unlockedRanks.includes(rank));
  }).join("");
}

// Sorts from highest to lowest percent and keeps the first 3
function topThree(results) {
  return results.slice().sort((a, b) => b.percent - a.percent).slice(0, 3);
}

function getMajorName(majorId) {
  const major = MAJORS.find(item => item.id === majorId);
  return major ? major.name : majorId;
}

function cleanPercent(number) {
  return Math.round(Math.min(100, Math.max(0, number)));
}

function meterHTML(percent) {
  return `<span class="meter" aria-hidden="true"><span class="meter-fill" style="width: ${percent}%"></span></span>`;
}

function resultCardHTML(result, rank, isUnlocked) {
  const percent = cleanPercent(result.percent);
  const top = `
    <div class="result-top">
      <p class="result-rank">#${rank}</p>
      <p class="result-percent"><span class="result-percent-label">ភាពសាកសម</span> ${percent}%</p>
    </div>`;

  if (!isUnlocked) {
    const lockNote = rank === 3 ? "ដោះសោជាមួយកញ្ចប់ A ឬ កញ្ចប់ B" : "ដោះសោជាមួយកញ្ចប់ B";
    return `
      <article class="result-card is-locked">
        ${top}
        <h4 class="result-major"><span aria-hidden="true">🔒</span> ត្រូវបានចាក់សោ</h4>
        ${meterHTML(percent)}
        <p class="result-lock-note">${lockNote}</p>
        ${lockedUniversityPreviewHTML()}
      </article>`;
  }

  const rows = Object.keys(BREAKDOWN_LABELS).map(part => {
    const value = cleanPercent(result.breakdown[part] || 0);
    return `
      <div class="breakdown-row">
        <dt>${BREAKDOWN_LABELS[part]}</dt>
        <dd>${meterHTML(value)} ${value}%</dd>
      </div>`;
  }).join("");

  return `
    <article class="result-card">
      ${top}
      <h4 class="result-major">${getMajorName(result.major)}</h4>
      ${meterHTML(percent)}
      <dl class="breakdown">${rows}</dl>
      ${universitySectionHTML(result.major)}
    </article>`;
}


// =========================================================
// 9. University listings (data comes from universities.js)
// =========================================================

// University data is typed in by people, so make it safe before putting it in HTML
function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Only allow normal web links (blocks things like "javascript:")
function safeUrl(url) {
  return typeof url === "string" && /^https?:\/\//i.test(url.trim()) ? url.trim() : null;
}

function hasValue(value) {
  return value !== null && value !== undefined && String(value).trim() !== "";
}

function getProgramsForMajor(majorId) {
  return UNIVERSITY_PROGRAMS.filter(program =>
    program.majorId === majorId && (SHOW_SAMPLE_DATA || !program.isSample)
  );
}

// A scholarship only counts when it has an official link AND a real verification date
function getVerifiedScholarships(program) {
  return (program.scholarships || []).filter(scholarship =>
    safeUrl(scholarship.officialUrl) && hasValue(scholarship.lastVerified)
  );
}

// Returns a number we can safely compare with the student's budget, or null.
// Only when the currency AND the payment period match the filter.
// For a range (e.g. 1000–1500) we use the HIGHEST amount, so we never promise
// that a program fits a budget when part of its cost might not.
function getComparableTuition(program) {
  if (program.tuitionCurrency !== FILTER_CURRENCY) {
    return null;
  }
  if (program.tuitionPeriod !== universityFilters.period) {
    return null;
  }
  if (typeof program.tuitionMax === "number") {
    return program.tuitionMax;
  }
  if (typeof program.tuitionMin === "number") {
    return program.tuitionMin;
  }
  return null; // unknown tuition is never treated as 0
}

function filterPrograms(programs) {
  let hiddenNotComparable = 0;

  const shown = programs.filter(program => {
    if (universityFilters.city && program.city !== universityFilters.city) {
      return false;
    }
    if (universityFilters.scholarshipOnly && getVerifiedScholarships(program).length === 0) {
      return false;
    }
    if (universityFilters.maxTuition !== null) {
      const amount = getComparableTuition(program);
      if (amount === null) {
        hiddenNotComparable = hiddenNotComparable + 1;
        return false;
      }
      if (amount > universityFilters.maxTuition) {
        return false;
      }
    }
    return true;
  });

  return { shown, hiddenNotComparable };
}

function warningHTML() {
  return `<span class="info-warning"><span aria-hidden="true">⚠</span> ${INFO_WARNING}</span>`;
}

function formatAmount(number) {
  return number.toLocaleString("en-US");
}

function tuitionHTML(program) {
  const min = typeof program.tuitionMin === "number" ? program.tuitionMin : null;
  const max = typeof program.tuitionMax === "number" ? program.tuitionMax : null;
  const notes = hasValue(program.tuitionNotes)
    ? `<span class="uni-note">${escapeHTML(program.tuitionNotes)}</span>`
    : "";

  if (min === null && max === null) {
    return NOT_AVAILABLE + notes;
  }

  let amount;
  if (min !== null && max !== null && min !== max) {
    amount = `${formatAmount(min)}–${formatAmount(max)}`;
  } else {
    amount = formatAmount(min !== null ? min : max);
  }

  const currency = hasValue(program.tuitionCurrency)
    ? escapeHTML(program.tuitionCurrency)
    : "(រូបិយប័ណ្ណមិនទាន់បញ្ជាក់)";
  const period = TUITION_PERIOD_LABELS[program.tuitionPeriod] || "រយៈពេលបង់ប្រាក់មិនទាន់បញ្ជាក់";
  const checked = hasValue(program.tuitionCheckedYear)
    ? `ពិនិត្យឆ្នាំ ${escapeHTML(program.tuitionCheckedYear)}`
    : "មិនទាន់បញ្ជាក់ឆ្នាំពិនិត្យ";

  return `
    <span class="uni-amount">${amount} ${currency}</span>
    <span class="uni-meta">${period} · ${checked}</span>
    ${warningHTML()}
    ${notes}`;
}

function scholarshipsHTML(program) {
  const verified = getVerifiedScholarships(program);
  if (verified.length === 0) {
    return "មិនទាន់មានព័ត៌មានអាហារូបករណ៍ដែលបានផ្ទៀងផ្ទាត់";
  }
  return `<ul class="uni-scholarships">${verified.map(scholarship => {
    const name = scholarship.nameKm || scholarship.name || NOT_AVAILABLE;
    const deadline = hasValue(scholarship.deadline)
      ? escapeHTML(scholarship.deadline)
      : "មិនទាន់មានកាលបរិច្ឆេទផុតកំណត់";
    return `
      <li>
        <a href="${escapeHTML(safeUrl(scholarship.officialUrl))}" target="_blank" rel="noopener">${escapeHTML(name)}</a>
        ${hasValue(scholarship.coverage) ? `<span class="uni-meta">ការឧបត្ថម្ភ៖ ${escapeHTML(scholarship.coverage)}</span>` : ""}
        ${hasValue(scholarship.eligibility) ? `<span class="uni-meta">លក្ខខណ្ឌ៖ ${escapeHTML(scholarship.eligibility)}</span>` : ""}
        <span class="uni-meta">ថ្ងៃផុតកំណត់៖ ${deadline}</span>
        ${warningHTML()}
      </li>`;
  }).join("")}</ul>`;
}

function linksHTML(program) {
  const links = [];
  const website = safeUrl(program.officialWebsite);
  const programPage = safeUrl(program.programUrl);
  const social = safeUrl(program.socialMediaUrl);

  if (website) {
    links.push(`<a href="${escapeHTML(website)}" target="_blank" rel="noopener">គេហទំព័រផ្លូវការ</a>`);
  }
  if (programPage) {
    links.push(`<a href="${escapeHTML(programPage)}" target="_blank" rel="noopener">ទំព័រកម្មវិធីសិក្សា</a>`);
  }
  if (social) {
    links.push(`<a href="${escapeHTML(social)}" target="_blank" rel="noopener">បណ្តាញសង្គម</a>`);
  }
  return links.length > 0 ? links.join(" · ") : NOT_AVAILABLE;
}

function factHTML(label, valueHTML) {
  return `<div class="uni-fact"><dt>${label}</dt><dd>${valueHTML}</dd></div>`;
}

function programCardHTML(program) {
  const nameKm = hasValue(program.universityNameKm) ? escapeHTML(program.universityNameKm) : null;
  const nameEn = hasValue(program.universityNameEn) ? escapeHTML(program.universityNameEn) : null;
  const programName = program.programNameKm || program.programNameEn;

  const badges = [];
  if (program.isSample) {
    badges.push(`<span class="uni-badge uni-badge-sample">SAMPLE</span>`);
  }
  if (program.verificationStatus !== "verified") {
    badges.push(`<span class="uni-badge">មិនទាន់ផ្ទៀងផ្ទាត់ពេញលេញ</span>`);
  }

  return `
    <article class="uni-card">
      ${badges.length > 0 ? `<p class="uni-badges">${badges.join(" ")}</p>` : ""}
      <h5 class="uni-name">${nameKm || nameEn || NOT_AVAILABLE}</h5>
      ${nameKm && nameEn ? `<p class="uni-name-en">${nameEn}</p>` : ""}
      <p class="uni-program">${hasValue(programName) ? escapeHTML(programName) : NOT_AVAILABLE}</p>
      ${hasValue(program.programType) ? `<p class="uni-program-type">ប្រភេទកម្មវិធី៖ ${escapeHTML(program.programType)}</p>` : ""}
      <dl class="uni-facts">
        ${factHTML("ទីតាំង", hasValue(program.city) ? escapeHTML(program.city) : NOT_AVAILABLE)}
        ${factHTML("តម្លៃសិក្សា", tuitionHTML(program))}
        ${factHTML("ភាសាបង្រៀន", hasValue(program.languageOfInstruction) ? escapeHTML(program.languageOfInstruction) : NOT_AVAILABLE)}
        ${factHTML("លក្ខខណ្ឌចូលរៀន", hasValue(program.entryRequirements) ? escapeHTML(program.entryRequirements) : NOT_AVAILABLE)}
        ${factHTML("អាហារូបករណ៍", scholarshipsHTML(program))}
        ${factHTML("តំណភ្ជាប់", linksHTML(program))}
      </dl>
      <p class="uni-verified">ពិនិត្យចុងក្រោយ៖ ${hasValue(program.lastVerified) ? escapeHTML(program.lastVerified) : "មិនទាន់បានពិនិត្យ"}</p>
    </article>`;
}

function majorDetailsHTML(majorId) {
  const details = MAJOR_DETAILS[majorId];
  if (!details) {
    return "";
  }
  let html = "";
  if (hasValue(details.descriptionKm)) {
    html += `<p class="uni-major-description">${escapeHTML(details.descriptionKm)}</p>`;
  }
  if (Array.isArray(details.typicalCareers) && details.typicalCareers.length > 0) {
    html += `
      <p class="uni-careers">
        <strong>អាជីពដែលអាចធ្វើបាន</strong> (ឧទាហរណ៍ មិនមែនការធានា)៖
        ${details.typicalCareers.map(escapeHTML).join(" · ")}
      </p>`;
  }
  return html;
}

// University section inside an UNLOCKED result card
function universitySectionHTML(majorId) {
  const programs = getProgramsForMajor(majorId);
  let body;

  if (programs.length === 0) {
    body = `<p class="uni-empty">មិនទាន់មានព័ត៌មានអំពីសាកលវិទ្យាល័យសម្រាប់ជំនាញនេះនៅឡើយទេ។</p>`;
  } else {
    const { shown, hiddenNotComparable } = filterPrograms(programs);
    body = shown.length > 0
      ? shown.map(programCardHTML).join("")
      : `<p class="uni-empty">គ្មានកម្មវិធីសិក្សាដែលត្រូវនឹងតម្រងរបស់អ្នកទេ។</p>`;
    if (hiddenNotComparable > 0) {
      body += `<p class="uni-empty">${hiddenNotComparable} កម្មវិធីត្រូវបានលាក់ ព្រោះមិនអាចប្រៀបធៀបតម្លៃសិក្សាជាមួយថវិការបស់អ្នកបាន (តម្លៃ រូបិយប័ណ្ណ ឬរយៈពេលបង់ប្រាក់មិនច្បាស់)។</p>`;
    }
  }

  return `
    <details class="uni-section" open>
      <summary>កន្លែងសិក្សា (${programs.length})</summary>
      ${majorDetailsHTML(majorId)}
      ${body}
    </details>`;
}

// LOCKED result card: only grey blurred bars — no university names, prices or counts are in the page
function lockedUniversityPreviewHTML() {
  return `
    <div class="uni-locked">
      <div class="uni-skeleton" aria-hidden="true">
        <span></span><span></span><span></span>
      </div>
      <p class="uni-locked-note"><span aria-hidden="true">🔒</span> ដោះសោដើម្បីមើលសាកលវិទ្យាល័យ និងតម្លៃសិក្សា</p>
    </div>`;
}

// Fill the City list with the cities that exist in the data
function populateCityFilter() {
  const cities = [];
  UNIVERSITY_PROGRAMS.forEach(program => {
    if ((SHOW_SAMPLE_DATA || !program.isSample) && hasValue(program.city) && !cities.includes(program.city)) {
      cities.push(program.city);
    }
  });
  cities.sort();
  filterCity.innerHTML = `<option value="">ទាំងអស់</option>` +
    cities.map(city => `<option value="${escapeHTML(city)}">${escapeHTML(city)}</option>`).join("");
  filterCity.value = universityFilters.city;
}

// Warn (in the console) if a program points to a major that does not exist.
// Programs with majorId null are simply not linked yet — they are counted, not warned about one by one.
function checkProgramMajorIds() {
  let notLinked = 0;
  UNIVERSITY_PROGRAMS.forEach(program => {
    if (program.majorId === null) {
      notLinked = notLinked + 1;
    } else if (!MAJORS.some(major => major.id === program.majorId)) {
      console.warn(`universities.js: majorId "${program.majorId}" (${program.universityId}) is not in majors.js`);
    }
  });
  if (notLinked > 0) {
    console.info(`universities.js: ${notLinked} programs are not linked to a KITE major yet (majorId: null)`);
  }
}


// --- Events for the filters ---

filterCity.addEventListener("change", () => {
  universityFilters.city = filterCity.value;
  renderResults();
});

filterMaxTuition.addEventListener("input", () => {
  const value = filterMaxTuition.value.trim();
  const number = Number(value);
  universityFilters.maxTuition = value === "" || Number.isNaN(number) || number < 0 ? null : number;
  renderResults();
});

filterPeriod.addEventListener("change", () => {
  universityFilters.period = filterPeriod.value;
  renderResults();
});

filterScholarship.addEventListener("change", () => {
  universityFilters.scholarshipOnly = filterScholarship.checked;
  renderResults();
});

filterClear.addEventListener("click", () => {
  universityFilters.city = "";
  universityFilters.maxTuition = null;
  universityFilters.period = "year";
  universityFilters.scholarshipOnly = false;
  filterCity.value = "";
  filterMaxTuition.value = "";
  filterPeriod.value = "year";
  filterScholarship.checked = false;
  renderResults();
});


// =========================================================
// 10. Start the page
// =========================================================

checkProgramMajorIds();
populateCityFilter();
renderPackages();
renderAssessment(false);
renderResults();
