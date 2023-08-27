// ----------------------------------
// HANDLE THE VIEW FOR A QUESTION
// ----------------------------------

import {createElementFromTemplate, closeModal} from './templates/utils.js';
import {questionViewTemplate, questionModalTemplate, questionAnswersTemplate} from './templates/question-view.js';
import {updatePreview} from './utils';

import moment from 'moment/src/moment';
import 'moment/src/locale/fr-ch';
import {baseUrl} from '../utils/config';
import {getAuthData} from './auth';
import axios from 'axios';

async function sendAnswer(formData) {
  try {
    return await axios.post(`${baseUrl}/api/answer/new`, formData);
  } catch {
    return null;
  }
}

async function sendLike(questionId, sciper, like) {
  if (like) {
    axios.post(`${baseUrl}/api/like/add/${questionId}/${sciper}`);
  } else {
    axios.delete(`${baseUrl}/api/like/remove/${questionId}/${sciper}`);
  }
}

// Fetch the question data from the API with axios
async function fetchQuestion(questionId) {
  const response = await axios.get(`${baseUrl}/api/question/get/${questionId}`, {
    headers: {
      Accept: 'application/json',
    },
  });
  return response.data.question;
}

async function handleFormSubmission(form, questionId, successToastElement, errorToastElement, previewBody, previewBodyText, preview, directView, questionContainer) {
  const formData = new FormData(form);
  const toastOptions = {delay: 5000};
  const authData = getAuthData();

  // TODO: don't forget to uncomment this
  if (true /*authData && authData.sciper*/) {
    // Append the question data to the form data
    //formData.append('sciper', authData.sciper);
    formData.append('sciper', '315940');
    formData.append('question-id', questionId);

    // Send the form data to the server with axios
    const response = await sendAnswer(formData);

    if (response.status === 200) {
      const successToast = new bootstrap.Toast(successToastElement, toastOptions);
      successToast.show();

      // Reset the form
      previewBodyText.textContent = '';
      preview.classList.add('d-none');
      form.classList.remove('was-validated');
      form.reset();

      // Reload the question view
      // initializeQuestionView(questionContainer, questionId, directView);
      return;
    }
  }

  const errorToast = new bootstrap.Toast(errorToastElement, toastOptions);
  errorToast.show();
}

function addFormSubmitEventListener(form, questionId, successToastElement, errorToastElement, previewBody, previewBodyText, preview, directView, questionContainer) {
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
      } else {
        handleFormSubmission(form, questionId, successToastElement, errorToastElement, previewBody, previewBodyText, preview, directView, questionContainer);
      }
    });
  }
}

function addTextareaEventListener(textarea, preview, previewBody, previewBodyText) {
  if (textarea) {
    textarea.addEventListener('input', () => {
      updatePreview(textarea, preview, previewBody, previewBodyText);
    });
  }
}

function addLikeButtonEventListener(questionView, questionId) {
  const authData = getAuthData();
  if (authData) {
    const likeButton = questionView.querySelector('.question-likes');

    if (likeButton) {
      likeButton.classList.add('clickable');

      likeButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const likeCountValue = parseInt(likeButton.textContent);

        if (likeButton.classList.contains('liked')) {
          likeButton.textContent = likeCountValue - 1;
          likeButton.classList.remove('liked');
          sendLike(questionId, authData.sciper, false);
        } else {
          likeButton.textContent = likeCountValue + 1;
          likeButton.classList.add('liked');
          sendLike(questionId, authData.sciper, true);
        }
      });
    }
  }
}

// Add the event listeners to the back button and the close button of the modal
function addModalEventListeners(questionModal) {
  questionModal.addEventListener('click', (e) => {
    if (e.target.classList.contains('back-button') || e.target.classList.contains('btn-close')) {
      closeModal(questionModal);
      if (e.target.classList.contains('btn-close')) {
        closeModal(document.querySelector('.question-list-modal'), true);
      }
    }
  });
}

function addDirectViewEventListeners(questionView, questionId) {
  const topBar = document.createElement('div');
  topBar.classList.add('top-bar');
  topBar.innerHTML = `
    <a class="back-button" href="#" aria-label="Retour" title="Retour"></a>
    <h1 class="question-view-title">Question #${questionId}</h1>
  `;

  questionView.prepend(topBar);
  topBar.addEventListener('click', (e) => {
    if (e.target.classList.contains('back-button')) {
      e.preventDefault();
      topBar.remove();
      questionView.remove();

      document.querySelector('.top-bar').classList.remove('d-none');
      document.querySelector('.question-cards-wrapper').classList.remove('d-none');
    }
  });
}

async function initializeQuestionView(questionContainer, questionId, directView) {
  // Get the question data
  const question = await fetchQuestion(questionId);

  const authData = getAuthData();

  // Moment.js is used to format the date
  moment.locale('fr-ch');
  // Convert the date to a relative date
  question.date = moment(question.date).fromNow();

  // Add the image if there is one
  if (question.image) {
    question.image = `<img class="question-image" src="${baseUrl}/api/image/${question.image}" alt="Image de la question">`;
    //question.image = `<img class="question-image" src="data:image/png;base64,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" alt="Image de la question">`;
  } else {
    question.image = '';
  }

  // Remove everything in the question container
  // while (questionContainer.firstChild) questionContainer.removeChild(questionContainer.firstChild);

  // Add the question view
  const questionView = createElementFromTemplate(questionViewTemplate(question, true/*!!authData*/));
  questionContainer.appendChild(questionView, questionId);

  // Add the answers
  const answers = question.answers;
  const answersContainer = questionView.querySelector('.answers');
  // Sort the answers by relevance (accepted answer first, then by the user's role (teacher, assistant then student), then by the date)
  answers.sort((a, b) => {
    if (a.accepted && !b.accepted) return -1;
    if (!a.accepted && b.accepted) return 1;
    if (a.user_role === 'teacher' && b.user_role !== 'teacher') return -1;
    if (a.user_role !== 'teacher' && b.user_role === 'teacher') return 1;
    if (a.user_role === 'assistant' && b.user_role !== 'assistant') return -1;
    if (a.user_role !== 'assistant' && b.user_role === 'assistant') return 1;
    return new Date(b.date) - new Date(a.date);
  });
  answers.forEach((answer) => {
    // Convert the date to a relative date
    answer.date = moment(answer.date).fromNow();
    // Create the badge for the role
    if (answer.user_role === 'teacher') {
      answer.user_role = '<span class="badge text-bg-warning">Enseignant</span>';
    } else if (answer.user_role === 'assistant') {
      answer.user_role = '<span class="badge text-bg-secondary">Assistant</span>';
    } else {
      answer.user_role = '';
    }
    // Create the answer
    const answerElement = createElementFromTemplate(questionAnswersTemplate(answer));
    answersContainer.appendChild(answerElement);
  });

  if (directView) {
    addDirectViewEventListeners(questionView, questionId);
  } else {
    addModalEventListeners(questionView);
  }

  renderMathInElement(questionView);

  const form = questionView.querySelector('form');
  const successToastElement = questionView.querySelector('.form-toast.success');
  const errorToastElement = questionView.querySelector('.form-toast.error');
  const textarea = questionView.querySelector('textarea');
  const preview = questionView.querySelector('.preview');
  const previewBody = questionView.querySelector('.preview-body');
  const previewBodyText = questionView.querySelector('.preview-text');

  addLikeButtonEventListener(questionView, questionId)
  addTextareaEventListener(textarea, preview, previewBody, previewBodyText);
  addFormSubmitEventListener(form, questionId, successToastElement, errorToastElement, previewBody, previewBodyText, preview, directView, questionContainer);

}

function handleQuestionView(questionId, directView) {
  // Remove existing elements if they exist
  const existingModal = document.querySelector('.question-modal');
  if (existingModal) existingModal.remove();

  const existingView = document.querySelector('#questions .question-view');
  if (existingView) existingView.remove();

  if (directView) {
    const questionContainer = document.querySelector('#questions');
    initializeQuestionView(questionContainer, questionId, true);

    // Hide unnecessary UI components
    document.querySelector('.top-bar').classList.add('d-none');
    document.querySelector('.question-cards-wrapper').classList.add('d-none');
  } else {
    const questionModal = createElementFromTemplate(questionModalTemplate(questionId));
    document.body.appendChild(questionModal);
    const questionContainer = questionModal.querySelector('.content-wrapper');
    initializeQuestionView(questionContainer, questionId, false);
  }
}

export {handleQuestionView};