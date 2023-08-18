// ----------------------------------
// QUIZ UTILS
// ----------------------------------

function toggleClasses(element, ...classes) {
  classes.forEach((cls) => {
    element.classList.toggle(cls);
  });
}

// Handle quiz button to show the answers
function quizAnswers() {
  const quizzes = document.querySelectorAll('.quiz');
  quizzes.forEach((quiz) => {
    const quizButton = quiz.querySelector('.quiz-button');
    const quizAnswers = quiz.querySelectorAll('.quiz-answer');
    const quizTooltips = quiz.querySelectorAll('.quiz-tooltip');

    quizButton.addEventListener('click', () => {
      quizAnswers.forEach((quizAnswer) => {
        toggleClasses(quizAnswer, quizAnswer.dataset.answer === 'true' ? 'true' : 'false');
      });
      quizTooltips.forEach((quizTooltip) => {
        toggleClasses(quizTooltip, 'tooltip-show');
      });
    });
  });
}

// Select all the divs with class "quiz-answer-user" and add a click event listener to toggle
// between the classes "true", "false" and nothing
function quizUserAnswers() {
  document.addEventListener('click', (e) => {
    const quizAnswer = e.target.closest('.quiz-answer-user');
    if (quizAnswer) {
      if (quizAnswer.classList.contains('true')) {
        toggleClasses(quizAnswer, 'true', 'false');
      } else if (quizAnswer.classList.contains('false')) {
        toggleClasses(quizAnswer, 'false');
      } else {
        toggleClasses(quizAnswer, 'true');
      }
    }
  });
}

function quizzes() {
  quizAnswers();
  quizUserAnswers();
}

export {quizzes};