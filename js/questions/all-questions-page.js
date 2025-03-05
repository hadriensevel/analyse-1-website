// ----------------------------------
// ALL QUESTIONS PAGE
// ----------------------------------

import {createElementFromTemplate} from './templates/utils';
import {questionCardsWrapperTemplate} from './templates/question-cards-wrapper';
import {loadQuestionCards} from './handle-question-card';
import {QuestionLocation} from './utils';
import {getFeatureFlag} from '../utils/feature-flags';

async function allQuestions() {
  // Create wrapper for the questions
  const questionsDiv = document.createElement('div');
  questionsDiv.id = 'all-questions';
  const questionCardsWrapper = createElementFromTemplate(questionCardsWrapperTemplate(true));
  questionsDiv.appendChild(questionCardsWrapper);

  // Select the first script tag and insert the questions div before it
  const scriptTag = document.body.querySelector('script');
  scriptTag.before(questionsDiv);

  // Check the feature flag for the questions
  const questionsFeatureFlag = await getFeatureFlag('questions');
  if (questionsFeatureFlag === false) {
    questionsDiv.innerHTML = '<p>Les questions ne sont pas disponibles pour le moment.</p>';
    return;
  }

  // Get the id of the question if it is in the URL of the parent page and remove it
  const urlParams = new URLSearchParams(window.parent.location.search);
  const questionId = urlParams.get('question') ?? null;
  const questionsPageRaw = urlParams.get('questionsPage') ?? null
  const questionsPage = questionsPageRaw ? parseInt(questionsPageRaw) : null;
  if (questionId) {
    urlParams.delete('question');
    const newRelativePathQuery = window.parent.location.pathname + '?' + urlParams.toString();
    window.parent.history.pushState(null, '', newRelativePathQuery);
  }

  // Load the question cards
  loadQuestionCards(`#${questionsDiv.id}`, QuestionLocation.ALL_QUESTIONS, undefined, undefined, questionId, questionsPage);
}

document.addEventListener('DOMContentLoaded', () => {
  allQuestions();
});
