// ----------------------------------
// HANDLE MODAL FOR NEW QUESTIONS
// ----------------------------------

import {createElementFromTemplate, closeModal} from "./templates/utils.js";
import {newQuestionModalTemplate} from "./templates/new-question-modal.js";
import {loadQuestionCards} from './handle-question-card';
import {getAuthData} from './auth';
import {getFileName} from './utils';


function initializeNewQuestionForm(newQuestionModal) {
  const form = newQuestionModal.querySelector('form');
  const successToastElement = newQuestionModal.querySelector('.form-toast.success');
  const errorToastElement = newQuestionModal.querySelector('.form-toast.error');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add('was-validated');
    } else {
      const formData = new FormData(form);
      const divId = formData.get('div-id');
      const questionTitle = formData.get('question-title');
      const questionText = formData.get('question-text');
      const toastOptions = {delay: 10000};

      // Get the authentication details (sciper number)
      const authData = getAuthData();

      if (authData && authData.sciper) {
        const sciper = authData.sciper;
        const section = getFileName();

        // TODO: send the question to the server
        //console.log(sciper, divId, section, questionTitle, questionText)

        const successToast = new bootstrap.Toast(successToastElement, toastOptions);
        successToast.show();

        form.classList.remove('was-validated');
        form.reset();
      } else {
        const errorToast = new bootstrap.Toast(errorToastElement, toastOptions);
        errorToast.show();
      }
    }
  });

  newQuestionModal.addEventListener('click', (e) => {
    if (e.target.classList.contains('back-button')) {
      closeModal(newQuestionModal);
    } else if (e.target.classList.contains('btn-close')) {
      closeModal(newQuestionModal);
      closeModal(document.querySelector('.question-list-modal'));
    }
  });
}

function handleNewQuestionModal(divId) {
  // Check and remove any existing instance of the new question modal
  const existingModal = document.querySelector('.new-question-modal');
  if (existingModal) existingModal.remove();

  const newQuestionModal = createElementFromTemplate(newQuestionModalTemplate(divId));
  document.body.appendChild(newQuestionModal);

  initializeNewQuestionForm(newQuestionModal);
}
export {handleNewQuestionModal};