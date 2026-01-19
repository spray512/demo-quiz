let userAnswers = [];
let correctCount = 0;
let wrongCount = 0;
let unattemptedCount = 0;

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

// Shuffle questions ONCE and take first 10
let shuffledQuestions = [...questions]
  .sort(() => Math.random() - 0.5)
  .slice(0, 10);

// ----------- DOM ELEMENTS -----------
const qCurrentEl = document.getElementById("q-current");
const qTotalEl = document.getElementById("q-total");
const timeLeftEl = document.getElementById("time-left");
const timerBadge = document.getElementById("timer-badge");
const progressBar = document.getElementById("progress-bar");

const questionTextEl = document.getElementById("question-text");
const optionsEl = document.getElementById("options");

// We no longer need Next button
const nextBtn = document.getElementById("next-btn");
if (nextBtn) {
  nextBtn.style.display = "none";
}

// ----------- LOAD QUESTION -----------
function loadQuestion() {
  clearInterval(timer);
  timeLeft = 10;
  optionsEl.innerHTML = "";

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  // Update question counter
  qCurrentEl.innerText = currentQuestionIndex + 1;
  qTotalEl.innerText = shuffledQuestions.length;

  // Set question text
  questionTextEl.innerText = currentQuestion.question;

  // Reset timer UI
  timeLeftEl.innerText = timeLeft;
  timerBadge.classList.remove("danger");
  progressBar.classList.remove("danger");
  progressBar.style.width = "100%";

  // Create options
  currentQuestion.options.forEach((option, index) => {
    const optionDiv = document.createElement("div");
    optionDiv.classList.add("option");

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "option";
    radio.value = index;
    radio.id = `opt-${index}`;

    const label = document.createElement("label");
    label.setAttribute("for", `opt-${index}`);
    label.innerHTML = `<strong>${String.fromCharCode(65 + index)}</strong> ${option}`;

    optionDiv.appendChild(radio);
    optionDiv.appendChild(label);

    // Auto-submit on click
    optionDiv.addEventListener("click", () => {
      // prevent double click
      if (optionDiv.classList.contains("selected")) return;

      // remove selected from all
      document.querySelectorAll(".option").forEach(opt => {
        opt.classList.remove("selected");
      });

      // select this one
      radio.checked = true;
      optionDiv.classList.add("selected");

      // small delay for visual feedback, then auto-submit
      setTimeout(() => {
        submitAnswer();
      }, 300);
    });

    optionsEl.appendChild(optionDiv);
  });

  startTimer();
}

// ----------- TIMER FUNCTION -----------
function startTimer() {
  timeLeft = 10;
  timeLeftEl.innerText = timeLeft;
  timerBadge.classList.remove("danger");
  progressBar.classList.remove("danger");
  progressBar.style.width = "100%";

  timer = setInterval(() => {
    timeLeft--;
    timeLeftEl.innerText = timeLeft;

    // Update progress bar
    const percent = (timeLeft / 10) * 100;
    progressBar.style.width = percent + "%";

    // Danger state when 3 seconds left
    if (timeLeft <= 3) {
      timerBadge.classList.add("danger");
      progressBar.classList.add("danger");
    }

    if (timeLeft === 0) {
      clearInterval(timer);
      submitAnswer();
    }
  }, 1000);
}

// ----------- SUBMIT ANSWER -----------
function submitAnswer() {
  clearInterval(timer);

  const selectedOption = document.querySelector("input[name='option']:checked");
  const correctAnswer = shuffledQuestions[currentQuestionIndex].answer;

  let selectedIndex = null;

if (selectedOption) {
  selectedIndex = parseInt(selectedOption.value);

  if (selectedIndex === correctAnswer) {
    score += 1;
    correctCount++;
  } else {
    score -= 0.25;
    wrongCount++;
  }
} else {
  unattemptedCount++;
}

// Store full answer data for analysis
userAnswers.push({
  question: shuffledQuestions[currentQuestionIndex].question,
  options: shuffledQuestions[currentQuestionIndex].options,
  correctIndex: correctAnswer,
  selectedIndex: selectedIndex
});


  currentQuestionIndex++;

  if (currentQuestionIndex < shuffledQuestions.length) {
    loadQuestion();
  } else {
    // Save final score
    sessionStorage.setItem("finalScore", score.toFixed(2));
    sessionStorage.setItem("correctCount", correctCount);
    sessionStorage.setItem("wrongCount", wrongCount);
    sessionStorage.setItem("unattemptedCount", unattemptedCount);
    sessionStorage.setItem("userAnswers", JSON.stringify(userAnswers));

    window.location.href = "result.html";


  }
}

// ----------- START QUIZ -----------
loadQuestion();
