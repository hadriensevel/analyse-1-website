// ----------------------------------
// HANDLE View FOR NEW QUESTIONS
// ----------------------------------

import {createElementFromTemplate, closeModal} from './templates/utils.js';
import {newQuestionFormTemplate, newQuestionModalTemplate} from './templates/new-question-view.js';
import {getAuthData} from './auth';
import {getFileName} from './utils';
import {updatePreview} from './utils';
import {baseUrl} from '../utils/config';

import axios from 'axios';

async function sendQuestion(formData) {
  try {
    return await axios.post(`${baseUrl}/api/question/new`, formData, {
      withCredentials: true,
    });
  } catch {
    return null;
  }
}

function scrollToTop(form, directView) {
  if (directView) {
    const formWrapper = form.closest('.new-question-view');
    if (formWrapper) {
      const rect = formWrapper.getBoundingClientRect();
      const scrollTop = document.documentElement.scrollTop;
      const topPosition = rect.top + scrollTop;

      window.scrollTo({
        top: topPosition,
        behavior: 'smooth'
      });
    }
  } else {
    const modalBody = form.closest('.modal-body');
    if (modalBody) {
      modalBody.scrollTo({top: 0, behavior: 'smooth'});
    }
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
    setValidity('Le fichier est trop gros (max 5 Mo).');
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
async function handleFormSubmission(form, questionLocation, successToastElement, errorToastElement, previewBody, previewBodyText, preview) {
  const formData = new FormData(form);
  const toastOptions = {delay: 5000};

  if (getAuthData()) {
    // Append the question data to the form data
    formData.append('page', getFileName());
    formData.append('question-location', questionLocation);

    // Send the form data to the server with axios
    const response = await sendQuestion(formData);

    if (response && response.status === 200) {
      const successToast = new bootstrap.Toast(successToastElement, toastOptions);
      successToast.show();

      // Reset the form
      previewBodyText.textContent = '';
      if (previewBody.querySelector('img')) previewBody.querySelector('img').remove();
      preview.classList.add('d-none');
      form.classList.remove('was-validated');
      form.reset();
      return;
    }
  }

  const errorToast = new bootstrap.Toast(errorToastElement, toastOptions);
  errorToast.show();
}

function addFormSubmitEventListener(form, questionLocation, successToastElement, errorToastElement, previewBody, previewBodyText, preview, directView) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add('was-validated');
    } else {
      handleFormSubmission(form, questionLocation, successToastElement, errorToastElement, previewBody, previewBodyText, preview);
    }

    // Smooth scroll to the top
    scrollToTop(form, directView);
  });
}

// Add the event listeners to the back button and the close button of the modal
function addModalEventListeners(newQuestionModal) {
  newQuestionModal.addEventListener('click', (e) => {
    if (e.target.classList.contains('back-button') || e.target.classList.contains('btn-close')) {
      closeModal(newQuestionModal);
      if (e.target.classList.contains('btn-close')) {
        closeModal(document.querySelector('.question-list-modal'), true);
      }
    }
  });
}

// Add the back button to the new question form
function addDirectViewEventListeners(newQuestionView) {
  const topBar = document.createElement('div');
  topBar.classList.add('top-bar');
  topBar.innerHTML = `
    <a class="back-button" href="#" aria-label="Retour" title="Retour"></a>
    <h1 class="new-question-view-title">Nouvelle question</h1>
  `;

  newQuestionView.prepend(topBar);
  topBar.addEventListener('click', (e) => {
    if (e.target.classList.contains('back-button')) {
      e.preventDefault();
      topBar.remove();
      newQuestionView.remove();

      document.querySelector('.top-bar').classList.remove('d-none');
      document.querySelector('.question-cards-wrapper').classList.remove('d-none');
    }
  });
}

// Initialize the new question form
function initializeNewQuestionForm(newQuestionView, questionLocation, directView = false) {
  const form = newQuestionView.querySelector('form');
  const successToastElement = newQuestionView.querySelector('.form-toast.success');
  const errorToastElement = newQuestionView.querySelector('.form-toast.error');
  const textarea = form.querySelector('textarea');
  const preview = form.querySelector('.preview');
  const previewBody = form.querySelector('.preview-body');
  const previewBodyText = form.querySelector('.preview-text');
  const fileInput = form.querySelector('input[type="file"]');

  textarea.addEventListener('input', () => updatePreview(textarea, preview, previewBody, previewBodyText));
  fileInput.addEventListener('change', () => handleFileInput(fileInput, preview, previewBody, textarea));
  addFormSubmitEventListener(form, questionLocation, successToastElement, errorToastElement, previewBody, previewBodyText, preview, directView);

  if (directView) {
    addDirectViewEventListeners(newQuestionView);
  } else {
    addModalEventListeners(newQuestionView);
  }
}

// Take the div with the given ID from the polycop and append it to the target element
function initializeDivPolycopView(targetElement, divId) {
  if (!divId) return;

  // If divId starts with a number, escape it
  const divIdStartsWithNumber = /^\d/.test(divId);
  if (divIdStartsWithNumber) divId = `\\3${divId}`;

  const questionDiv = document.querySelector(`#${divId} .div-container`);
  const divView = targetElement.querySelector('.content-wrapper .div-view');
  if (questionDiv && divView) divView.appendChild(questionDiv.cloneNode(true));
}

// Append the form to the target element and initialize it
function appendAndInitializeForm(targetElement, questionLocation, isDirect = false) {
  targetElement.appendChild(createElementFromTemplate(newQuestionFormTemplate()));
  const newQuestionView = targetElement.querySelector('.new-question-view');
  initializeNewQuestionForm(newQuestionView, questionLocation, isDirect);
}

function handleNewQuestionView(divId = '', questionLocation, directView = false) {
  // Remove existing elements if they exist
  const existingModal = document.querySelector('.new-question-modal');
  if (existingModal) existingModal.remove();

  const existingForm = document.querySelector('#questions .new-question-view');
  if (existingForm) existingForm.remove();

  if (directView) {
    const questionsContainer = document.querySelector('#questions');
    appendAndInitializeForm(questionsContainer, questionLocation, true);

    // Hide unnecessary UI components
    document.querySelector('.top-bar').classList.add('d-none');
    document.querySelector('.question-cards-wrapper').classList.add('d-none');
  } else {
    const newQuestionModal = createElementFromTemplate(newQuestionModalTemplate(divId));
    document.body.appendChild(newQuestionModal);
    initializeDivPolycopView(newQuestionModal, divId);
    initializeNewQuestionForm(newQuestionModal, questionLocation);
  }
}

export {handleNewQuestionView};