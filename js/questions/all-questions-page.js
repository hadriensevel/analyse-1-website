// ----------------------------------
// ALL QUESTIONS PAGE
// ----------------------------------

import {createElementFromTemplate} from './templates/utils.js';
import {questionCardsWrapperTemplate} from './templates/question-cards-wrapper';
import {loadQuestionCards} from './handle-question-card';

function allQuestions() {
  // Create wrapper for the questions
  const questionsDiv = document.createElement('div');
  questionsDiv.id = 'all-questions';
  const questionCardsWrapper = createElementFromTemplate(questionCardsWrapperTemplate(true));
  questionsDiv.appendChild(questionCardsWrapper);

  // Select the first script tag and insert the questions div before it
  const scriptTag = document.body.querySelector('script');
  scriptTag.before(questionsDiv);

  // Load the question cards
  loadQuestionCards('#all-questions', '');
}

document.addEventListener('DOMContentLoaded', () => {
  allQuestions();
});
