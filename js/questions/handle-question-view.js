// ----------------------------------
// HANDLE THE VIEW FOR A QUESTION
// ----------------------------------

import {createElementFromTemplate, closeModal} from './templates/utils.js';
import {questionViewTemplate, questionModalTemplate, questionAnswersTemplate} from './templates/question-view.js';
import {updatePreview} from './utils';

import moment from 'moment/src/moment';
import 'moment/src/locale/fr-ch';
import {baseUrl, supportEmail} from '../utils/config';
import {getAuthData} from './auth';
import axios from 'axios';

async function sendAnswer(formData) {
  try {
    return await axios.post(`${baseUrl}/api/answer/new`, formData);
  } catch {
    return null;
  }
}

async function sendLike(questionId, like) {
  const endpoint = like ? 'add' : 'remove';
  const method = like ? 'post' : 'delete';
  axios[method](`${baseUrl}/api/like/${endpoint}/${questionId}`);
}

// Fetch the question data from the API with axios
async function fetchQuestion(questionId) {
  try {
    const response = await axios.get(`${baseUrl}/api/question/get/${questionId}`, {
      headers: {
        Accept: 'application/json',
      },
    });
    return response.data.question;
  } catch {
    return null;
  }
}

function showToast(toastElement, toastOptions = {delay: 5000}) {
  const toast = new bootstrap.Toast(toastElement, toastOptions);
  toast.show();
}

async function handleFormSubmission(elements) {
  const {
    form,
    questionId,
    successToastElement,
    errorToastElement,
    previewBodyText,
    preview,
    questionView
  } = elements;
  const formData = new FormData(form);

  // TODO: don't forget to reactivate authentication here
  if (getAuthData()) {
    formData.append('question-id', questionId);

    const response = await sendAnswer(formData);

    if (response.status === 200) {
      showToast(successToastElement);

      form.reset();
      previewBodyText.textContent = '';
      preview.classList.add('d-none');
      form.classList.remove('was-validated');

      // Rerender the question
      await populateAnswers(questionView, questionId);
      return;
    }
  }
  showToast(errorToastElement);
}

function setupEventListeners(elements) {
  const {
    form,
    textarea,
    preview,
    previewBody,
    previewBodyText,
    questionView,
    questionId,
    directView,
  } = elements;

  addFormSubmitEventListener({
    form,
    questionId,
    successToastElement: questionView.querySelector('.form-toast.success'),
    errorToastElement: questionView.querySelector('.form-toast.error'),
    previewBodyText,
    preview,
    directView,
    questionView
  });
  addTextareaEventListener(textarea, preview, previewBody, previewBodyText);
  addLikeButtonEventListener(questionView, questionId);

  if (directView) {
    addDirectViewEventListeners(questionView, questionId);
  } else {
    addModalEventListeners(questionView);
  }
}

function addFormSubmitEventListener(elements) {
  const {
    form
  } = elements;
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add('was-validated');
    } else {
      handleFormSubmission(elements);
    }
  });
}

function addTextareaEventListener(textarea, preview, previewBody, previewBodyText) {
  if (textarea) {
    textarea.addEventListener('input', () => {
      updatePreview(textarea, preview, previewBody, previewBodyText);
    });
  }
}

function addLikeButtonEventListener(questionView, questionId) {
  if (getAuthData()) {
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
          sendLike(questionId, false);
        } else {
          likeButton.textContent = likeCountValue + 1;
          likeButton.classList.add('liked');
          sendLike(questionId, true);
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

async function initializeQuestionView(questionContainer, questionId, directView = false) {
  const question = await fetchQuestion(questionId);

  if (question === null) {
    // Display an error message
    const errorElement = createElementFromTemplate(`
      <div class="question-view">
        <h6>Oups...</h6>
        <p>Nous n'avons pas réussi à récupérer la question, peut-être qu'elle n'existe plus :(</p>
        <p>Si vous pensez que c'est une erreur, n'hésitez pas à nous contacter ici: <a href="mailto:${supportEmail}?subject=Erreur lors du chargement de la question #${questionId}">${supportEmail}</a>.</p>
      </div>
    `);
    questionContainer.appendChild(errorElement);

    if (directView) {
      addDirectViewEventListeners(errorElement, questionId);
    } else {
      addModalEventListeners(errorElement);
    }
    return;
  }

  formatQuestionData(question);

  // TODO: don't forget to activate authentication here
  const questionView = createElementFromTemplate(questionViewTemplate(question, !!getAuthData()));
  questionContainer.appendChild(questionView);

  await populateAnswers(questionView, questionId);

  renderMathInElement(questionView);

  const elements = {
    textarea: questionView.querySelector('textarea'),
    form: questionView.querySelector('form'),
    preview: questionView.querySelector('.preview'),
    previewBody: questionView.querySelector('.preview-body'),
    previewBodyText: questionView.querySelector('.preview-text'),
    questionView,
    questionId,
    directView,
    questionContainer
  };

  setupEventListeners(elements);
}

async function populateAnswers(questionView, questionId) {
  // Clear existing answers
  const answersContainer = questionView.querySelector('.answers');
  while (answersContainer.firstChild) {
    answersContainer.firstChild.remove();
  }

  const question = await fetchQuestion(questionId);
  const answers = question.answers;

  sortAnswers(answers).forEach(answer => {
    formatAnswerData(answer);
    const answerElement = createElementFromTemplate(questionAnswersTemplate(answer));
    answersContainer.appendChild(answerElement);
  });

  renderMathInElement(answersContainer);
}

function formatQuestionData(question) {
  moment.locale('fr-ch');
  question.date = moment(question.date).fromNow();
  question.image = question.image ?
    `<img class="question-image" src="${baseUrl}/api/image/${question.image}" alt="Image de la question">` :
    '';
}

function formatAnswerData(answer) {
  answer.date = moment(answer.date).fromNow();
  answer.user_role = getUserRoleBadge(answer.user_role);
}

function getUserRoleBadge(role) {
  const roles = {
    'teacher': '<span class="badge text-bg-warning">Enseignant</span>',
    'assistant': '<span class="badge text-bg-secondary">Assistant</span>',
  };
  return roles[role] || '';
}

function sortAnswers(answers) {
  return answers.sort((a, b) => {
    if (a.accepted !== b.accepted) return b.accepted - a.accepted;
    if (a.user_role !== b.user_role) return rolesPriority(a.user_role) - rolesPriority(b.user_role);
    return new Date(b.date) - new Date(a.date);
  });
}

function rolesPriority(role) {
  const priorities = {
    'teacher': 1,
    'assistant': 2,
    'student': 3
  };
  return priorities[role] || 4;
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