// ----------------------------------
// QUIZ UTILS
// ----------------------------------

// TODO: Show quiz answers & tooltips
function quizAnswers() {
  const quizzes = document.querySelectorAll('.quiz');

  quizzes.forEach((quiz) => {
    const quizButton = quiz.querySelector('.quiz-button');
    const quizAnswers = quiz.querySelectorAll('.quiz-answer');
    const quizTooltips = quiz.querySelectorAll('.quiz-tooltip');

    quizButton.addEventListener('click', () => {
      quizAnswers.forEach((quizAnswer) => {
        if (quizAnswer.dataset.answer === 'true') {
          quizAnswer.classList.toggle('true');
        } else if (quizAnswer.dataset.answer === 'false') {
          quizAnswer.classList.toggle('false');
        }
      });
      quizTooltips.forEach((quizTooltip) => {
        quizTooltip.classList.toggle('tooltip-show');
      });
    });
  });
}

// Select all the divs with class "quiz-answer-user" and add a click event listener to toggle
// between the classes "true", "false" and nothing
function quizUserAnswers() {
  const quizAnswers = document.querySelectorAll('.quiz-answer-user');
  quizAnswers.forEach((quizAnswer) => {
    quizAnswer.addEventListener('click', () => {
      if (quizAnswer.classList.contains('true')) {
        quizAnswer.classList.remove('true');
        quizAnswer.classList.add('false');
      } else if (quizAnswer.classList.contains('false')) {
        quizAnswer.classList.remove('false');
      } else {
        quizAnswer.classList.add('true');
      }
    });
  });
}

function quizzes() {
  quizAnswers();
  quizUserAnswers();
}

export {quizzes};