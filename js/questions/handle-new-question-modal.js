// ----------------------------------
// HANDLE MODAL FOR NEW QUESTIONS
// ----------------------------------

import {createElementFromTemplate} from "../templates/utils.js";
import {newQuestionModalTemplate} from "../templates/new-question-modal.js";
import {closeQuestionListModal} from './handle-question-list-modal';

function handleNewQuestionModal(divId) {

  // Takes the modal template and appends it at the end of the body
  const newQuestionModal = createElementFromTemplate(newQuestionModalTemplate(divId));
  document.body.appendChild(newQuestionModal);

  // Handle form validation and submission
  const form = newQuestionModal.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // If the form is valid, submit it. Otherwise, display an error message
    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add('was-validated')
    } else {
      // Get the form data (questionTitle and questionText)
      const formData = new FormData(form);
      const divId = formData.get('div-id');
      const questionTitle = formData.get('question-title');
      const questionText = formData.get('question-text');
      console.log(divId, questionTitle, questionText)

      // TODO: send the data to the server

      // TODO: display a success or error message
      const toastOptions = {delay: 10000};
      const successToast = new bootstrap.Toast(newQuestionModal.querySelector('.form-toast.success'), toastOptions);
      const errorToast = new bootstrap.Toast(newQuestionModal.querySelector('.form-toast.error'), toastOptions);
      successToast.show();
      //errorToast.show();

      // Reset the form
      form.classList.remove('was-validated');
      form.reset();
    }
  });

  // Handle the back button
  const backButton = newQuestionModal.querySelector('.back-button');
  backButton.addEventListener('click', () => {
    closeNewQuestionModal(newQuestionModal);
  });

  // Handle the close button
  const closeButton = newQuestionModal.querySelector('.btn-close');
  closeButton.addEventListener('click', () => {
    closeNewQuestionModal(newQuestionModal);
    closeQuestionListModal(document.querySelector('.question-list-modal'));
  });
}

// Close, dispose and remove the modal
function closeNewQuestionModal(newQuestionModal) {
  const modalBootstrap = new bootstrap.Modal(newQuestionModal);
  modalBootstrap.hide();
  modalBootstrap.dispose();
  newQuestionModal.remove();
}

export {handleNewQuestionModal};