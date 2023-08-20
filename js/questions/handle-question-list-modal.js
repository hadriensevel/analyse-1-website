// ----------------------------------
// HANDLE THE MODAL FOR QUESTIONS
// ----------------------------------

import {createElementFromTemplate, closeModal} from "./templates/utils.js";
import {questionListModalTemplate} from "./templates/question-list-modal.js";
import {handleNewQuestionModal} from './handle-new-question-modal';
import {getAuthData} from './auth';
import {getFeatureFlag} from '../utils/feature-flags';

function addEventListenersToModal(questionListModal) {
  questionListModal.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-close')) {
      closeModal(questionListModal);
    } else if (e.target.classList.contains('new-question-button')) {
      const divId = e.target.closest('.modal').dataset.divId;
      handleNewQuestionModal(divId);
      new bootstrap.Modal(document.querySelector('.new-question-modal')).show();
    }
  });
}

function initializeQuestionListModal(questionListModal) {
  questionListModal.addEventListener('shown.bs.modal', (e) => {
    renderMathInElement(questionListModal.querySelector('.modal-content'));
  });

  addEventListenersToModal(questionListModal);
}

async function handleQuestionListModal(divId) {
  // Ensure only one modal instance exists at a time.
  const existingModal = document.querySelector('.question-list-modal');
  if (existingModal) existingModal.remove();

  // Check the feature flag for new questions
  let newQuestion = false;
  const newQuestionEnabled = await getFeatureFlag('newQuestion');
  if (newQuestionEnabled) {
    // Check if the user is authenticated
    const authData = getAuthData();
    //newQuestion = authData !== null;
    newQuestion = true;
  }

  // Create the modal
  const questionListModal = createElementFromTemplate(questionListModalTemplate(divId, newQuestion));
  document.body.appendChild(questionListModal);

  initializeQuestionListModal(questionListModal);
}

export {handleQuestionListModal};