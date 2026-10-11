let questions = [];
let currentQuestionIndex = 0;

async function loadQuestions() {
  const response = await fetch('domain1_mcq_questions.json');
  questions = await response.json();
  displayQuestion();
}

function displayQuestion() {
  const questionElement = document.getElementById('question');
  const choicesElement = document.getElementById('choices');
  const currentQuestion = questions[currentQuestionIndex];

  questionElement.textContent = currentQuestion.question_text;
  choicesElement.innerHTML = '';

  // Shuffle choices
  const shuffledChoices = currentQuestion.choices.sort(() => Math.random() - 0.5);

  shuffledChoices.forEach(choice => {
    const button = document.createElement('button');
    button.textContent = choice;
    button.onclick = () => checkAnswer(choice, currentQuestion.correct_choice);
    choicesElement.appendChild(button);
  });
}

function checkAnswer(selected, correct) {
  if (selected === correct) {
    alert('Correct!');
  } else {
    alert(`Incorrect. The correct answer is: ${correct}`);
  }
}

document.getElementById('next-btn').addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    displayQuestion();
  } else {
    alert('Quiz completed!');
  }
});

loadQuestions();

