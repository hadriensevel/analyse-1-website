// ----------------------------------
// ALL QUESTIONS
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
  document.body.firstChild.before(questionsDiv);

  // Load the question cards
  loadQuestionCards('', '#questions', QuestionLocation.EXERCISE);
}

document.addEventListener('DOMContentLoaded', () => {
  allQuestions();
});

export {allQuestions};