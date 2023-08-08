// ----------------------------------
// HANDLE THE MODAL FOR QUESTIONS
// ----------------------------------

import {createElementFromTemplate} from "../templates/utils.js";
import {questionListModalTemplate} from "../templates/question-list-modal.js";
import {handleNewQuestionModal} from './handle-new-question-modal';

// Take the modal template and append it at the end of the body
function handleQuestionListModal(divId) {
  const questionListModal = createElementFromTemplate(questionListModalTemplate(divId));
  document.body.appendChild(questionListModal);
  questionListModal.addEventListener('shown.bs.modal', (e) => {
    renderMathInElement(questionListModal.querySelector('.modal-content'));
  });

  // Handle the close button
  const closeButton = questionListModal.querySelector('.btn-close');
  closeButton.addEventListener('click', () => {
    closeQuestionListModal(questionListModal)
  });

  // Handle the new question button
  const newQuestionButton = questionListModal.querySelector('.new-question-button');
  newQuestionButton.addEventListener('click', () => {
    handleNewQuestionModal(divId)
    new bootstrap.Modal(document.querySelector('.new-question-modal')).show();
  });
}

// Close, dispose and remove the modal
function closeQuestionListModal(questionListModal) {
  const modalBootstrap = new bootstrap.Modal(questionListModal);
  modalBootstrap.hide();
  modalBootstrap.dispose();
  questionListModal.remove();
}

export {handleQuestionListModal, closeQuestionListModal};