let currentQuestion = 0;
let score = 0;
let questions = [];

fetch('questions.json')
  .then(res => res.json())
  .then(data => {
    questions = data;
    showQuestion();
  });

function showQuestion() {
  const container = document.getElementById('question-container');
  const question = questions[currentQuestion];
  
  container.innerHTML = `
    <h3>${question.question}</h3>
    ${question.choices.map((choice, idx) => `
      <button class="choice-btn" onclick="checkAnswer('${choice}', '${question.correct_answer}')">${choice}</button>
    `).join('')}
    <p><em>Source: ${question.resource}</em></p>
  `;
}

function checkAnswer(selected, correct) {
  const buttons = document.querySelectorAll('.choice-btn');
  buttons.forEach(btn => {
    if (btn.textContent === correct) {
      btn.classList.add('correct');
    } else if (btn.textContent === selected) {
      btn.classList.add('incorrect');
    }
    btn.disabled = true;
  });

  if (selected === correct) score++;

  document.getElementById('score').textContent = `Score: ${score} / ${questions.length}`;
}

document.getElementById('next-btn').addEventListener('click', () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    document.getElementById('question-container').innerHTML = '<h2>Quiz Complete!</h2>';
    document.getElementById('next-btn').style.display = 'none';
  }
});
