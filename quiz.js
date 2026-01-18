// ----------- NAVIGATION LOCK -----------
history.pushState(null, null, location.href);
window.onpopstate = function () {
  history.pushState(null, null, location.href);
};

// ----------- VARIABLES -----------
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 10;

// Shuffle questions ONCE
let shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);

// ----------- DOM ELEMENTS -----------
const questionNumberEl = document.getElementById("question-number");
const timerEl = document.getElementById("timer");
const questionTextEl = document.getElementById("question-text");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");

// ----------- LOAD QUESTION -----------
function loadQuestion() {
  clearInterval(timer);
  timeLeft = 10;
  nextBtn.disabled = true;
  optionsEl.innerHTML = "";

  let currentQuestion = shuffledQuestions[currentQuestionIndex];

  questionNumberEl.innerText = `Question ${currentQuestionIndex + 1} / 10`;
  questionTextEl.innerText = currentQuestion.question;

  currentQuestion.options.forEach((option, index) => {
    const optionDiv = document.createElement("div");
    optionDiv.classList.add("option");

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "option";
    radio.value = index;

    radio.addEventListener("change", () => {
      nextBtn.disabled = false;
    });

    const label = document.createElement("label");
    label.innerText = option;

    optionDiv.appendChild(radio);
    optionDiv.appendChild(label);
    optionsEl.appendChild(optionDiv);
  });

  startTimer();
}

// ----------- TIMER -----------
function startTimer() {
  timerEl.innerText = `Time Left: ${timeLeft}s`;

  timer = setInterval(() => {
    timeLeft--;
    timerEl.innerText = `Time Left: ${timeLeft}s`;

    if (timeLeft === 0) {
      clearInterval(timer);
      submitAnswer();
    }
  }, 1000);
}

// ----------- SUBMIT ANSWER -----------
function submitAnswer() {
  clearInterval(timer);

  let selectedOption = document.querySelector("input[name='option']:checked");
  let correctAnswer = shuffledQuestions[currentQuestionIndex].answer;

  if (selectedOption) {
    if (parseInt(selectedOption.value) === correctAnswer) {
      score += 1;
    } else {
      score -= 0.25;
    }
  }
  // if not selected → score unchanged (0)

  currentQuestionIndex++;

  if (currentQuestionIndex < 10) {
    loadQuestion();
  } else {
    sessionStorage.setItem("finalScore", score.toFixed(2));
    window.location.href = "result.html";
  }
}

// ----------- NEXT BUTTON -----------
nextBtn.addEventListener("click", submitAnswer);

// ----------- START QUIZ -----------
loadQuestion();
