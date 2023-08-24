// ----------------------------------
// HANDLE MODAL FOR NEW QUESTIONS
// ----------------------------------

import {createElementFromTemplate, closeModal} from "./templates/utils.js";
import {newQuestionModalTemplate} from "./templates/new-question-modal.js";
import {getAuthData} from './auth';
import {getFileName} from './utils';

// Escape HTML and keep the newlines
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

// Update the preview when the user types in the textarea
function updatePreview(textarea, preview, previewBody, previewBodyText) {
  // If the textarea is empty, hide the preview
  const isEmpty = !textarea.value;
  const hasImage = !!previewBody.querySelector('img');
  if (isEmpty) {
    previewBodyText.textContent = '';
    if (!hasImage) {
      preview.classList.add('d-none');
    }
  } else {
    preview.classList.remove('d-none');
    // Escape HTML and render LaTeX but take the newlines into account
    previewBodyText.innerHTML = escapeHTML(textarea.value);
    renderMathInElement(previewBodyText);
  }
}

// Handle the file input
function handleFileInput(fileInput, preview, previewBody, textarea) {
  const file = fileInput.files[0];
  let imageElement = previewBody.querySelector('img');
  const invalidFeedback = fileInput.nextElementSibling;

  // Set the validity of the file input
  function setValidity(error) {
    invalidFeedback.textContent = error || '';
    fileInput.setCustomValidity(error || '');
    fileInput.classList[error ? 'add' : 'remove']('is-invalid');
  }

  // If no file is selected, remove existing image and hide the preview
  if (!file) {
    if (imageElement) {
      imageElement.remove();
    }
    if (!textarea.value) {
      preview.classList.add('d-none');
    }
    setValidity();
    return;
  }

  // Check if the file is an image
  if (!file.type.startsWith('image/')) {
    setValidity('Le fichier doit être une image (png, jpeg, gif, etc.).');
    return;
  }

  // Check if the file is too big
  if (file.size > 5 * 1024 * 1024) {
    setValidity('Le fichier est trop gros (5 Mo maximum).');
    return;
  }

  setValidity();

  // Add the image to the preview
  const reader = new FileReader();
  reader.onload = (e) => {
    if (!imageElement) {
      imageElement = document.createElement('img');
      imageElement.classList.add('preview-image');
      previewBody.appendChild(imageElement);
    }
    imageElement.src = e.target.result;
  };
  reader.readAsDataURL(file);
  preview.classList.remove('d-none');
}

// Handle the form submission
function handleFormSubmission(form, questionLocation, successToastElement, errorToastElement, previewBody, previewBodyText, preview) {
  const formData = new FormData(form);
  const toastOptions = {delay: 10000};
  const authData = getAuthData();

  if (authData && authData.sciper) {
    // Append the question data to the form data
    formData.append('sciper', authData.sciper);
    formData.append('section', getFileName());
    formData.append('questionLocation', questionLocation);

    // TODO: send the form data to the server with axios
    // Send the form data to the server with axios
    //const response = sendQuestion(formData);

    const successToast = new bootstrap.Toast(successToastElement, toastOptions);
    successToast.show();

    // Reset the form
    previewBodyText.textContent = '';
    if (previewBody.querySelector('img')) previewBody.querySelector('img').remove();
    preview.classList.add('d-none');
    form.classList.remove('was-validated');
    form.reset();
  } else {
    const errorToast = new bootstrap.Toast(errorToastElement, toastOptions);
    errorToast.show();
  }
}

function initializeNewQuestionForm(newQuestionModal, questionLocation) {
  const form = newQuestionModal.querySelector('form');
  const successToastElement = newQuestionModal.querySelector('.form-toast.success');
  const errorToastElement = newQuestionModal.querySelector('.form-toast.error');
  const textarea = form.querySelector('textarea');
  const preview = form.querySelector('.preview');
  const previewBody = form.querySelector('.preview-body');
  const previewBodyText = form.querySelector('.preview-text');
  const fileInput = form.querySelector('input[type="file"]');

  // Create event listeners
  textarea.addEventListener('input', () => updatePreview(textarea, preview, previewBody, previewBodyText));
  fileInput.addEventListener('change', () => handleFileInput(fileInput, preview, previewBody, textarea));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add('was-validated');
    } else {
      handleFormSubmission(form, questionLocation, successToastElement, errorToastElement, previewBody, previewBodyText, preview);
    }
  });

  newQuestionModal.addEventListener('click', (e) => {
    if (e.target.classList.contains('back-button') || e.target.classList.contains('btn-close')) {
      closeModal(newQuestionModal);
      if (e.target.classList.contains('btn-close')) {
        closeModal(document.querySelector('.question-list-modal'));
      }
    }
  });
}

function handleNewQuestionModal(divId = '', questionLocation) {
  // Check and remove any existing instance of the new question modal
  const existingModal = document.querySelector('.new-question-modal');
  if (existingModal) existingModal.remove();

  const newQuestionModal = createElementFromTemplate(newQuestionModalTemplate(divId));
  document.body.appendChild(newQuestionModal);
  initializeNewQuestionForm(newQuestionModal, questionLocation);
}
export {handleNewQuestionModal};