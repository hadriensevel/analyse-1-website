// ----------------------------------
// HANDLE THE MODAL FOR A QUESTION
// ----------------------------------

import {createElementFromTemplate, closeModal} from './templates/utils.js';
import {questionModalTemplate} from "./templates/question-modal.js";

function handleQuestionModal(questionId) {
  // Check and remove any existing instance of the new question modal
  const existingModal = document.querySelector('.question-modal');
  if (existingModal) existingModal.remove();

  const questionModal = createElementFromTemplate(questionModalTemplate());
  document.body.appendChild(questionModal);

  questionModal.addEventListener('shown.bs.modal', (e) => {
    renderMathInElement(questionModal.querySelector('.modal-content'));
  });

  questionModal.addEventListener('click', (e) => {
    if (e.target.classList.contains('back-button')) {
      closeModal(questionModal);
    } else if (e.target.classList.contains('btn-close')) {
      closeModal(questionModal);
      closeModal(document.querySelector('.question-list-modal'));
    }
  });
}

export {handleQuestionModal};