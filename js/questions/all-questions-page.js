// ----------------------------------
// ALL QUESTIONS PAGE
// ----------------------------------

import {createElementFromTemplate} from './templates/utils.js';
import {questionCardsWrapperTemplate} from './templates/question-cards-wrapper';
import {loadQuestionCards} from './handle-question-card';
import {QuestionLocation} from './utils';

function allQuestions() {
  // Create wrapper for the questions
  const questionsDiv = document.createElement('div');
  questionsDiv.id = 'questions';
  const questionCardsWrapper = createElementFromTemplate(questionCardsWrapperTemplate(true));
  questionsDiv.appendChild(questionCardsWrapper);

  // Select the first script tag and insert the questions div before it
  const scriptTag =   document.body.querySelector('script');
  scriptTag.before(questionsDiv);

  // Add message that the feature is not implemented yet
  const message = document.createElement('div');
  message.innerHTML = `<p>La page "Toutes les questions" n'est pas encore implémentée.</p>`;
  questionsDiv.appendChild(message);

  // Load the question cards
  //loadQuestionCards('', '#questions', QuestionLocation.EXERCISE);
}

document.addEventListener('DOMContentLoaded', () => {
  allQuestions();
});
