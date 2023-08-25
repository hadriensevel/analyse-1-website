// ----------------------------------
// HANDLE THE VIEW FOR A QUESTION
// ----------------------------------

import {createElementFromTemplate, closeModal} from './templates/utils.js';
import {questionModalTemplate} from "./templates/question-modal.js";
import {newQuestionModalTemplate} from './templates/new-question-view';

function handleQuestionView(questionId, directView) {
  // Remove existing elements if they exist
  const existingModal = document.querySelector('.question-modal');
  if (existingModal) existingModal.remove();

  const existingView = document.querySelector('#questions .question-view');
  if (existingView) existingView.remove();

  if (directView) {
    const questionsContainer = document.querySelector('#questions');
    //appendAndInitializeForm(questionsContainer, questionLocation, true);

    // Hide unnecessary UI components
    document.querySelector('.top-bar').classList.add('d-none');
    document.querySelector('.question-cards-wrapper').classList.add('d-none');
  } else {
    const questionModal = createElementFromTemplate(questionModalTemplate());
    document.body.appendChild(questionModal);
    //initializeNewQuestionForm(newQuestionModal, questionLocation);
  }

  /*questionModal.addEventListener('shown.bs.modal', (e) => {
    renderMathInElement(questionModal.querySelector('.modal-content'));
  });

  questionModal.addEventListener('click', (e) => {
    if (e.target.classList.contains('back-button')) {
      closeModal(questionModal);
    } else if (e.target.classList.contains('btn-close')) {
      closeModal(questionModal);
      closeModal(document.querySelector('.question-list-modal'), true);
    }
  });*/
}

export {handleQuestionView};