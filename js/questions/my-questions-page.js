// ----------------------------------
// MY QUESTIONS PAGE
// ----------------------------------

import {createElementFromTemplate} from './templates/utils';
import {questionCardsWrapperTemplate} from './templates/question-cards-wrapper';
import {loadQuestionCards} from './handle-question-card';
import {QuestionLocation} from './utils';
import {getFeatureFlag} from '../utils/feature-flags';
import {getAuthData, iframeAuthentication} from '../utils/auth';
import {baseUrl} from '../utils/config';
import {notAuthenticatedMessageTemplate} from './templates/question-card';

async function myQuestions() {
  // Create wrapper for the questions
  const questionsDiv = document.createElement('div');
  questionsDiv.id = 'my-questions';
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

  const user = getAuthData();

  if (!user) {
    // If the user is not authenticated, display a message
    const notAuthenticatedMessage = createElementFromTemplate(notAuthenticatedMessageTemplate(baseUrl));
    questionCardsWrapper.innerHTML = '';
    questionCardsWrapper.appendChild(notAuthenticatedMessage);
    return;
  }

  // Load the question cards
  loadQuestionCards(`#${questionsDiv.id}`, QuestionLocation.MY_QUESTIONS);
}

document.addEventListener('DOMContentLoaded', async () => {
  // Check if authentication
  const isAuthEnabled = await getFeatureFlag('authentication');
  if (isAuthEnabled) {
    await iframeAuthentication();
  }

  myQuestions();
});
