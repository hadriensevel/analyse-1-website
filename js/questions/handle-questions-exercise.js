// ----------------------------------
// HANDLE THE QUESTIONS IN EXERCISE
// ----------------------------------

import {loadQuestionCards} from './handle-question-card';
import {getFileName} from './utils';
import {createElementFromTemplate} from './templates/utils';
import {getAuthData} from './auth';
import {getFeatureFlag} from '../utils/feature-flags';
import {handleNewQuestionModal} from './handle-new-question-modal';

async function handleQuestionsExercise() {
  // Check the feature flag for questions
  const questionsEnabled = await getFeatureFlag('questions');
  if (!questionsEnabled) {
    const questionsBodyElement = document.querySelector('#questions');
    questionsBodyElement.innerHTML = '';
    const questionsDisabledElement = createElementFromTemplate(`
       <p class="questions-disabled-text">Le forum est désactivé pour le moment.</p>
    `);
    questionsBodyElement.appendChild(questionsDisabledElement);
    return;
  }

  const exerciseId = getFileName()
  console.log(exerciseId);
  // Load the question cards and add them in the tab
  await loadQuestionCards(exerciseId, '#questions');

  // Add the new question button
  // Check the feature flag for new questions
  let newQuestion = false;
  const newQuestionEnabled = await getFeatureFlag('newQuestion');
  if (newQuestionEnabled) {
    // Check if the user is authenticated
    const authData = getAuthData();
    //newQuestion = authData !== null;
    newQuestion = true;
  }

  if (newQuestion) {
    const questionsBodyElement = document.querySelector('#questions');
    const newQuestionButton = createElementFromTemplate(`
     <button type="button" class="new-question-button">Nouvelle question</button>
    `);
    questionsBodyElement.prepend(newQuestionButton);
  }

  // Add the event listener to the new question button
  const newQuestionButton = document.querySelector('.new-question-button');
  if (newQuestionButton) {
    newQuestionButton.addEventListener('click', () => {
      handleNewQuestionModal(exerciseId);
      new bootstrap.Modal(document.querySelector('.new-question-modal')).show();
    });
  }
}

export {handleQuestionsExercise};