// ----------------------------------
// HANDLE THE MODAL FOR QUESTIONS
// ----------------------------------

import {createElementFromTemplate, closeModal} from './templates/utils.js';
import {questionListModalTemplate} from './templates/question-list-modal.js';
import {loadQuestionCards} from './handle-question-card';
import {QuestionLocation} from './utils';

function handleQuestionListModal(divId, count) {
  // Ensure only one modal instance exists at a time.
  const existingModal = document.querySelector('.question-list-modal');
  if (existingModal) existingModal.remove();

  // Create the modal
  const questionListModal = createElementFromTemplate(questionListModalTemplate(divId, count));
  document.body.appendChild(questionListModal);

  // Add the event listeners for the close button
  const closeButton = questionListModal.querySelector('.btn-close');
  closeButton.addEventListener('click', (e) => {
    closeModal(questionListModal);
  });

  // Show the modal
  const questionListModalBootstrap = new bootstrap.Modal(document.querySelector('.question-list-modal'));
  questionListModalBootstrap.show();

  // Load the question cards and add them in the modal
  loadQuestionCards('.question-list-modal .content-wrapper', divId, QuestionLocation.COURSE);
}

export {handleQuestionListModal};