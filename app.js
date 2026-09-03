const components = [
  {
    id: "business",
    name: "Business requirements",
    short: "Business",
    definition:
      "State the business needs, supported processes, rules, priorities, KPIs, and value the BI solution must address.",
  },
  {
    id: "functional",
    name: "BI functional requirements",
    short: "Functional",
    definition:
      "Describe how people will use the solution through use cases, workflows, interactions, and analytical functions.",
  },
  {
    id: "data",
    name: "Data and quality requirements",
    short: "Data & quality",
    definition:
      "Specify data sources, integration, conformance, consistency, currency, availability, and acceptable quality.",
  },
  {
    id: "regulatory",
    name: "Regulatory and compliance requirements",
    short: "Compliance",
    definition:
      "Define the laws, regulations, privacy rules, security obligations, and organizational policies the solution must follow.",
  },
  {
    id: "technical",
    name: "Technical requirements",
    short: "Technical",
    definition:
      "Set constraints for infrastructure, platforms, approved technologies, performance, access, and system integration.",
  },
  {
    id: "replacement",
    name: "Replacement reporting requirements",
    short: "Replacement",
    definition:
      "Document existing reports, spreadsheets, shadow systems, and hidden logic that may need to be preserved, improved, or retired.",
  },
];

const cases = [
  {
    id: "b1",
    category: "business",
    type: "EXECUTIVE INTERVIEW",
    industry: "RETAIL",
    text: "Reduce stockouts of the 100 highest-revenue products by 15% before the holiday season without increasing total inventory.",
    explanation:
      "This is a business requirement because it defines the desired outcome, measurable target, scope, and business constraint.",
  },
  {
    id: "b2",
    category: "business",
    type: "KPI WORKSHOP",
    industry: "HIGHER EDUCATION",
    text: "Define an at-risk student as one who misses two consecutive assignments, and measure the percentage who return to active participation within 14 days.",
    explanation:
      "This is a business requirement because it defines a business rule, two performance measures, and the decision context.",
  },
  {
    id: "f1",
    category: "functional",
    type: "USER STORY",
    industry: "HEALTHCARE",
    text: "A clinic manager must be able to filter appointment no-shows by location and provider, then drill from the monthly rate to the affected appointment records.",
    explanation:
      "This is a functional requirement because it describes the user's filtering and drill-down interactions.",
  },
  {
    id: "f2",
    category: "functional",
    type: "USE CASE",
    industry: "BANKING",
    text: "When a fraud analyst selects a flagged transaction, the system must display the contributing risk indicators and allow the analyst to record an approve, decline, or escalate decision.",
    explanation:
      "This is a functional requirement because it specifies a user workflow, displayed information, and available actions.",
  },
  {
    id: "d1",
    category: "data",
    type: "DATA PROFILE",
    industry: "LOGISTICS",
    text: "Shipment IDs must match across the warehouse and carrier systems, delivery timestamps must use the same time zone, and missing destination ZIP codes must remain below 1%.",
    explanation:
      "This is a data and quality requirement because it sets conformance, consistency, and completeness expectations.",
  },
  {
    id: "d2",
    category: "data",
    type: "SOURCE INVENTORY",
    industry: "HOSPITALITY",
    text: "Room revenue must come from the property-management system, while guest satisfaction scores must come from the approved post-stay survey platform.",
    explanation:
      "This is a data requirement because it identifies the authoritative source for each required data element.",
  },
  {
    id: "r1",
    category: "regulatory",
    type: "COMPLIANCE REVIEW",
    industry: "HEALTHCARE",
    text: "The dashboard may show patient-level information only to authorized care-team members, and every access to those records must be logged for audit.",
    explanation:
      "This is a regulatory and compliance requirement because it controls protected information, authorization, and auditing.",
  },
  {
    id: "r2",
    category: "regulatory",
    type: "AI GOVERNANCE REVIEW",
    industry: "INSURANCE",
    text: "An AI model may recommend that a claim receive additional review, but a qualified employee must make the final decision and the recommendation may not use protected characteristics.",
    explanation:
      "This is a compliance requirement because it establishes human oversight and prohibited uses of sensitive attributes.",
  },
  {
    id: "t1",
    category: "technical",
    type: "ARCHITECTURE NOTE",
    industry: "MANUFACTURING",
    text: "The plant dashboard must run in the company's approved cloud environment, use corporate single sign-on, and load the production summary within five seconds.",
    explanation:
      "This is a technical requirement because it specifies the hosting platform, authentication method, and performance threshold.",
  },
  {
    id: "t2",
    category: "technical",
    type: "INTEGRATION NOTE",
    industry: "BANKING",
    text: "The BI solution must connect to the existing transaction API without modifying the core banking system and must support 300 simultaneous branch users.",
    explanation:
      "This is a technical requirement because it sets integration, system-boundary, and capacity constraints.",
  },
  {
    id: "x1",
    category: "replacement",
    type: "CURRENT-STATE AUDIT",
    industry: "RETAIL",
    text: "Document the formulas and manual adjustments in the regional sales workbook before replacing it, because managers say its margin total differs from the accounting system.",
    explanation:
      "This is a replacement reporting requirement because it reverse-engineers hidden logic in an existing shadow system.",
  },
  {
    id: "x2",
    category: "replacement",
    type: "REPORT INVENTORY",
    industry: "HIGHER EDUCATION",
    text: "Run the registrar's existing enrollment report beside the new dashboard for one census cycle, reconcile all differences, and retire the old report only after approval.",
    explanation:
      "This is a replacement reporting requirement because it governs parallel validation, reconciliation, approval, and retirement of an existing report.",
  },
];

const state = {
  screen: "start",
  round: 1,
  score: 0,
  streak: 0,
  bestStreak: 0,
  attempts: 0,
  correct: 0,
  hints: 0,
  selectedName: null,
  selectedDefinition: null,
  matched: new Set(),
  caseIndex: 0,
  cases: [],
  mistakes: new Map(),
  locked: false,
  muted: false,
  studyReturnScreen: "start",
  theme: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

let audioContext;
function tone(frequency, duration = 0.08, type = "sine") {
  if (state.muted) return;
  audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
  audioContext.resume();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.09, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

function showScreen(id) {
  $$(".screen").forEach((screen) => screen.classList.toggle("active", screen.id === id));
  state.screen = id.replace("-screen", "");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderStudyGrid() {
  $("#study-grid").innerHTML = components
    .map(
      (component, index) => `
        <article class="study-card">
          <span class="study-number">${String(index + 1).padStart(2, "0")}</span>
          <div>
            <h2>${component.name}</h2>
            <p>${component.definition}</p>
          </div>
        </article>`,
    )
    .join("");
}

function resetGame() {
  Object.assign(state, {
    round: 1,
    score: 0,
    streak: 0,
    bestStreak: 0,
    attempts: 0,
    correct: 0,
    hints: 0,
    selectedName: null,
    selectedDefinition: null,
    matched: new Set(),
    caseIndex: 0,
    cases: shuffle(cases),
    mistakes: new Map(),
    locked: false,
  });
  $("#round-one").classList.remove("hidden");
  $("#round-two").classList.add("hidden");
  $("#round-label").textContent = "ROUND 1 OF 2";
  $("#round-title").textContent = "Connect names to definitions";
  setFeedback("neutral", "Select a component, then select its definition.", "?");
  renderRoundOne();
  updateStats();
}

function renderRoundOne() {
  const shuffledDefinitions = shuffle(components);
  $("#name-column").innerHTML = components
    .map(
      (component) => `
        <button class="match-card name-card" type="button" data-id="${component.id}">
          <strong>${component.name}</strong>
          <small>Requirement component</small>
        </button>`,
    )
    .join("");
  $("#definition-column").innerHTML = shuffledDefinitions
    .map(
      (component) => `
        <button class="match-card definition-card" type="button" data-id="${component.id}">
          <span>${component.definition}</span>
        </button>`,
    )
    .join("");
  $$(".name-card").forEach((button) => button.addEventListener("click", () => selectMatch("name", button)));
  $$(".definition-card").forEach((button) =>
    button.addEventListener("click", () => selectMatch("definition", button)),
  );
}

function selectMatch(type, button) {
  if (button.disabled || state.locked) return;
  tone(420, 0.04);
  const selector = type === "name" ? ".name-card" : ".definition-card";
  $$(selector).forEach((card) => card.classList.remove("selected"));
  button.classList.add("selected");
  if (type === "name") state.selectedName = button.dataset.id;
  else state.selectedDefinition = button.dataset.id;
  setFeedback("neutral", type === "name" ? "Now choose its definition." : "Now choose the matching component.", "…");
  if (state.selectedName && state.selectedDefinition) evaluatePair();
}

function evaluatePair() {
  state.attempts += 1;
  const nameCard = $(`.name-card[data-id="${state.selectedName}"]`);
  const definitionCard = $(`.definition-card[data-id="${state.selectedDefinition}"]`);
  if (state.selectedName === state.selectedDefinition) {
    state.correct += 1;
    state.score += 100;
    state.streak += 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    state.matched.add(state.selectedName);
    nameCard.className = "match-card name-card matched";
    definitionCard.className = "match-card definition-card matched";
    nameCard.disabled = true;
    definitionCard.disabled = true;
    const component = components.find((item) => item.id === state.selectedName);
    setFeedback("success", `Correct. ${component.name} has been restored.`, "✓");
    tone(660, 0.08);
    window.setTimeout(() => tone(880, 0.1), 75);
    clearPair();
    updateStats();
    if (state.matched.size === components.length) window.setTimeout(startRoundTwo, 700);
  } else {
    state.streak = 0;
    state.score = Math.max(0, state.score - 15);
    incrementMistake(state.selectedName);
    incrementMistake(state.selectedDefinition);
    nameCard.classList.add("wrong");
    definitionCard.classList.add("wrong");
    setFeedback("error", "Not this pair. Compare what the definition emphasizes and try again.", "×");
    tone(180, 0.12, "square");
    state.locked = true;
    window.setTimeout(() => {
      nameCard.classList.remove("wrong", "selected");
      definitionCard.classList.remove("wrong", "selected");
      clearPair();
      state.locked = false;
    }, 550);
    updateStats();
  }
}

function clearPair() {
  state.selectedName = null;
  state.selectedDefinition = null;
}

function startRoundTwo() {
  state.round = 2;
  state.streak = 0;
  $("#round-one").classList.add("hidden");
  $("#round-two").classList.remove("hidden");
  $("#round-label").textContent = "ROUND 2 OF 2";
  $("#round-title").textContent = "Classify the project evidence";
  renderCategoryButtons();
  renderCase();
  updateStats();
}

function renderCategoryButtons() {
  $("#category-grid").innerHTML = components
    .map(
      (component) =>
        `<button class="category-button" type="button" data-id="${component.id}">${component.short}</button>`,
    )
    .join("");
  $$(".category-button").forEach((button) =>
    button.addEventListener("click", () => evaluateCase(button.dataset.id, button)),
  );
}

function renderCase() {
  const current = state.cases[state.caseIndex];
  $("#case-count").textContent = `Evidence ${state.caseIndex + 1} of ${state.cases.length}`;
  $("#evidence-type").textContent = current.type;
  $("#evidence-industry").textContent = current.industry;
  $("#case-text").textContent = current.text;
  $("#case-points").textContent = "Worth 50 points";
  $$(".category-button").forEach((button) => {
    button.disabled = false;
    button.classList.remove("correct", "incorrect", "hinted");
  });
  setFeedback("neutral", "Read the evidence carefully, then choose its requirement component.", "?");
}

function evaluateCase(categoryId, button) {
  if (state.locked) return;
  const current = state.cases[state.caseIndex];
  state.attempts += 1;
  if (categoryId === current.category) {
    state.correct += 1;
    state.score += 50;
    state.streak += 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    button.classList.add("correct");
    $$(".category-button").forEach((item) => (item.disabled = true));
    setFeedback("success", `Correct. ${current.explanation}`, "✓");
    tone(660, 0.08);
    window.setTimeout(() => tone(880, 0.1), 75);
    state.locked = true;
    updateStats();
    window.setTimeout(() => {
      state.caseIndex += 1;
      state.locked = false;
      if (state.caseIndex < state.cases.length) renderCase();
      else finishGame();
    }, 1150);
  } else {
    state.score = Math.max(0, state.score - 10);
    state.streak = 0;
    button.classList.add("incorrect");
    button.disabled = true;
    incrementMistake(categoryId);
    incrementMistake(current.category);
    const selected = components.find((item) => item.id === categoryId);
    const correct = components.find((item) => item.id === current.category);
    setFeedback(
      "error",
      `Not ${selected.short}. ${selected.short} focuses on ${categoryFocus(categoryId)}; this statement emphasizes ${categoryFocus(current.category)}. Try again.`,
      "×",
    );
    tone(180, 0.12, "square");
    updateStats();
  }
}

function categoryFocus(id) {
  const focus = {
    business: "business outcomes, rules, KPIs, and value",
    functional: "what users must see or do in the solution",
    data: "sources, integration, currency, and data quality",
    regulatory: "laws, privacy, security obligations, and organizational policies",
    technical: "platforms, infrastructure, performance, access, and integration constraints",
    replacement: "existing reports, spreadsheets, hidden logic, validation, and retirement",
  };
  return focus[id];
}

function useHint() {
  state.hints += 1;
  state.score = Math.max(0, state.score - 20);
  tone(520, 0.06);
  if (state.round === 1) {
    let targetId = state.selectedName || state.selectedDefinition;
    if (!targetId) targetId = components.find((item) => !state.matched.has(item.id)).id;
    const target =
      state.selectedName || !state.selectedDefinition
        ? $(`.definition-card[data-id="${targetId}"]`)
        : $(`.name-card[data-id="${targetId}"]`);
    target?.classList.add("hinted");
    window.setTimeout(() => target?.classList.remove("hinted"), 1600);
    setFeedback("neutral", "Hint: the matching card has been outlined in gold.", "!");
  } else {
    const current = state.cases[state.caseIndex];
    const target = $(`.category-button[data-id="${current.category}"]`);
    target?.classList.add("hinted");
    setFeedback("neutral", "Hint: the correct category has been outlined in gold.", "!");
  }
  updateStats();
}

function incrementMistake(id) {
  if (!components.some((item) => item.id === id)) return;
  state.mistakes.set(id, (state.mistakes.get(id) || 0) + 1);
}

function updateStats() {
  $("#score").textContent = state.score;
  $("#streak").textContent = state.streak;
  const complete = state.matched.size + state.caseIndex;
  $("#progress-bar").style.width = `${(complete / 18) * 100}%`;
}

function setFeedback(type, message, icon) {
  const feedback = $("#feedback");
  feedback.className = `feedback-bar ${type === "neutral" ? "" : type}`;
  $(".feedback-icon").textContent = icon;
  $("#feedback p").textContent = message;
}

function finishGame() {
  const accuracy = Math.round((state.correct / Math.max(state.attempts, 1)) * 100);
  $("#final-score").textContent = state.score;
  $("#accuracy-value").textContent = `${accuracy}%`;
  $("#best-streak").textContent = state.bestStreak;
  $("#hints-used").textContent = state.hints;
  if (accuracy >= 90) {
    $("#result-title").textContent = "Requirements mastery achieved";
    $("#result-message").textContent =
      "You can identify the six components by both definition and realistic project evidence.";
  } else if (accuracy >= 75) {
    $("#result-title").textContent = "Requirements restored";
    $("#result-message").textContent =
      "Strong work. Review the categories below, then replay to reach 90% mastery.";
  } else {
    $("#result-title").textContent = "Case needs one more review";
    $("#result-message").textContent =
      "You completed the file. Review the most-confused components, then replay the case.";
  }

  const reviewItems = [...state.mistakes.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => components.find((item) => item.id === id));
  $("#review-box").innerHTML = reviewItems.length
    ? `<strong>Review these components:</strong><ul>${reviewItems
        .map((item) => `<li><b>${item.name}:</b> ${item.definition}</li>`)
        .join("")}</ul>`
    : "<strong>Perfect file:</strong> You completed the case without confusing any requirement components.";
  $("#progress-bar").style.width = "100%";
  showScreen("result-screen");
  tone(523, 0.1);
  window.setTimeout(() => tone(659, 0.1), 100);
  window.setTimeout(() => tone(784, 0.16), 200);
}

function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = state.theme;
  $("#theme-toggle").setAttribute("aria-label", `Switch to ${state.theme === "dark" ? "light" : "dark"} mode`);
}

function toggleSound() {
  state.muted = !state.muted;
  $("#sound-toggle").setAttribute("aria-label", state.muted ? "Turn sound on" : "Mute sound");
  $("#sound-toggle").style.opacity = state.muted ? "0.52" : "1";
  if (!state.muted) tone(440, 0.06);
}

function openStudy() {
  state.studyReturnScreen = state.screen;
  showScreen("study-screen");
}

document.documentElement.dataset.theme = state.theme;
renderStudyGrid();
$("#start-button").addEventListener("click", () => {
  resetGame();
  showScreen("game-screen");
  tone(440, 0.05);
  window.setTimeout(() => tone(620, 0.08), 70);
});
$("#study-button").addEventListener("click", openStudy);
$("#close-study").addEventListener("click", () => showScreen(`${state.studyReturnScreen}-screen`));
$("#hint-button").addEventListener("click", useHint);
$("#play-again").addEventListener("click", () => {
  resetGame();
  showScreen("game-screen");
});
$("#review-map").addEventListener("click", openStudy);
$("#theme-toggle").addEventListener("click", toggleTheme);
$("#sound-toggle").addEventListener("click", toggleSound);

window.render_game_to_text = () =>
  JSON.stringify({
    screen: state.screen,
    round: state.round,
    score: state.score,
    streak: state.streak,
    matchedDefinitions: state.matched.size,
    evidenceIndex: state.caseIndex,
    evidenceTotal: state.cases.length,
    currentEvidence: state.round === 2 ? state.cases[state.caseIndex]?.text : null,
    selectedName: state.selectedName,
    selectedDefinition: state.selectedDefinition,
    hints: state.hints,
    coordinateSystem: "DOM puzzle; no spatial coordinates required",
  });

window.advanceTime = () => window.render_game_to_text();
window.__game = { components, cases, state, resetGame, startRoundTwo, finishGame };
