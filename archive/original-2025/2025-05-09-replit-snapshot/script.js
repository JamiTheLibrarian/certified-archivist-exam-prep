let flaggedQuestions = [];
let userAnswers = [];


// Sample questions
const questions = [
  {
    question: "The principle of 'respect des fonds' is most closely tied to which concept?",
    choices: ["Macroappraisal", "Functional analysis", "Provenance", "Deaccessioning"],
    correct: "Provenance",
    explanation: "Respect des fonds is the principle that records from a single origin should be kept together. This underlies the concept of provenance.",
    source: "ACA Study Guide"
  },
  {
    question: "Which of the following is an example of functional analysis?",
    choices: ["Counting the number of boxes received in a donation", "Evaluating archival materials based on their creators’ responsibilities", "Testing environmental conditions in storage areas", "Assigning call numbers to books"],
    correct: "Evaluating archival materials based on their creators’ responsibilities",
    explanation: "Functional analysis evaluates the functions of record creators to inform appraisal decisions.",
    source: "Boles"
  }
];

let currentQuestionIndex = 0;
let correctAnswers = 0;

function startQuiz(mode) {
  document.getElementById("home").style.display = "none";
  document.getElementById("quiz").style.display = "block";
  currentQuestionIndex = 0;
  correctAnswers = 0;
  loadQuestion();
}

function loadQuestion() {
  document.getElementById("flag-checkbox").checked = flaggedQuestions[currentQuestionIndex] || false;

  updateProgressBar();

  const q = questions[currentQuestionIndex];
  document.getElementById("question-text").textContent = q.question;

  const choicesContainer = document.getElementById("choices");
  choicesContainer.innerHTML = "";

  q.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => handleAnswer(choice);
    btn.classList.remove("disabled");
    choicesContainer.appendChild(btn);
  });

  // 🔹 Show/hide the Previous button based on question index
  const prevBtn = document.getElementById("prev-button");
  prevBtn.style.display = currentQuestionIndex === 0 ? "none" : "inline-block";

  // Clear feedback between questions
  document.getElementById("feedback").innerHTML = "";

  document.getElementById("progress-count").textContent = `${currentQuestionIndex + 1} of ${questions.length}`;
}



function handleAnswer(selected) {
  const q = questions[currentQuestionIndex];
  const choices = document.querySelectorAll("#choices button");

  choices.forEach(btn => {
    if (btn.textContent === selected) {
      btn.classList.add("selected"); // Apply selected first
    }
    if (btn.textContent === q.correct) {
      btn.classList.add("correct");
    } else if (btn.textContent === selected && selected !== q.correct) {
      btn.classList.add("incorrect");
    }
    btn.onclick = null;
    btn.classList.add("disabled");
  });

  if (selected === q.correct) {
    correctAnswers++;
  }

  userAnswers[currentQuestionIndex] = selected;

  let message = selected === q.correct
    ? "<strong>✅ Correct!</strong><br>"
    : `<strong>❌ Incorrect.</strong> The correct answer is <em>${q.correct}</em>.<br>`;

  document.getElementById("feedback").innerHTML = `
    ${message}
    <strong>Explanation:</strong> ${q.explanation}<br>
    <em>Source: ${q.source}</em>
  `;
}


function updateProgressBar() {
  const progressFill = document.getElementById("progress-fill");
  const percent = ((currentQuestionIndex + 1) / questions.length) * 100;
  progressFill.style.width = `${percent}%`;
}

function nextQuestion() {
  flaggedQuestions[currentQuestionIndex] = document.getElementById("flag-checkbox").checked;

  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

function previousQuestion() {
  flaggedQuestions[currentQuestionIndex] = document.getElementById("flag-checkbox").checked;
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuestion();
  }
}


function showResults() {
  document.getElementById("quiz").style.display = "none";
  document.getElementById("results").style.display = "block";
  const percentScore = Math.round((correctAnswers / questions.length) * 100);
const scoreSpan = document.getElementById("score");
scoreSpan.textContent = `${correctAnswers} / ${questions.length} (${percentScore}%)`;

// Reset any existing color classes
scoreSpan.classList.remove("score-green", "score-yellow", "score-red");

// Apply new class based on score
if (percentScore >= 85) {
  scoreSpan.classList.add("score-green");
} else if (percentScore >= 75) {
  scoreSpan.classList.add("score-yellow");
} else {
  scoreSpan.classList.add("score-red");
}
`;

const scoreMessage = document.getElementById("score-message");

if (percentScore >= 85) {
  scoreMessage.textContent = "🎉 Congratulations! That's a great score. Excellent work!";
} else if (percentScore >= 75) {
  scoreMessage.textContent = "👍 Good job! A little more review and you'll be all set.";
} else {
  scoreMessage.textContent = "📘 Keep studying — you’re building a strong foundation!";
}


  const reviewContainer = document.getElementById("review");
  reviewContainer.innerHTML = "<h3>Review: Flagged or Incorrect Answers</h3>";

  questions.forEach((q, i) => {
    const userAnswer = userAnswers[i];
    const wasFlagged = flaggedQuestions[i];
    const wasIncorrect = userAnswer !== q.correct;

    if (wasFlagged || wasIncorrect) {
      reviewContainer.innerHTML += `
        <div class="review-item">
          <p><strong>Q${i + 1}:</strong> ${q.question}</p>
          <p><strong>Your Answer:</strong> ${userAnswer || "<em>No answer</em>"}</p>
          <p><strong>Correct Answer:</strong> ${q.correct}</p>
          <p><strong>Explanation:</strong> ${q.explanation}</p>
          <p><strong>Source:</strong> <em>${q.source}</em></p>
          <hr />
        </div>
      `;
    }
  });
}


function goHome() {
  document.getElementById("results").style.display = "none";
  document.getElementById("home").style.display = "block";
}
