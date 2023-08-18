// ----------------------------------
// HANDLE MODAL FOR NEW QUESTIONS
// ----------------------------------

import {createElementFromTemplate, closeModal} from "../templates/utils.js";
import {newQuestionModalTemplate} from "../templates/new-question-modal.js";

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

      // TODO: send the data to the server

      const toastOptions = {delay: 10000};
      const successToast = new bootstrap.Toast(successToastElement, toastOptions);
      // Uncomment the line below if you want to handle errors
      // const errorToast = new bootstrap.Toast(errorToastElement, toastOptions);

      successToast.show();
      // errorToast.show();

      form.classList.remove('was-validated');
      form.reset();
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