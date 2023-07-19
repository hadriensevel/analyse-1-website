// TODO: Show quiz answers & tooltips

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

export {quizUserAnswers};