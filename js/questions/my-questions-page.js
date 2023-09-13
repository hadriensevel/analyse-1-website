// ----------------------------------
// MY QUESTIONS PAGE
// ----------------------------------

import {createElementFromTemplate} from './templates/utils';
import {questionCardsWrapperTemplate} from './templates/question-cards-wrapper';
import {loadQuestionCards} from './handle-question-card';
import {QuestionLocation} from './utils';

function myQuestions() {
  // Create wrapper for the questions
  const questionsDiv = document.createElement('div');
  questionsDiv.id = 'questions';
  const questionCardsWrapper = createElementFromTemplate(questionCardsWrapperTemplate(true));
  questionsDiv.appendChild(questionCardsWrapper);
  document.body.firstChild.before(questionsDiv);

  // Add message that the feature is not implemented yet
  const message = document.createElement('div');
  message.innerHTML = `<p>La page "Mes questions" n'est pas encore implémentée.</p>`;
  questionsDiv.appendChild(message);

  // Load the question cards
  //loadQuestionCards('', '#questions', QuestionLocation.EXERCISE);
}

document.addEventListener('DOMContentLoaded', () => {
  myQuestions();
});
