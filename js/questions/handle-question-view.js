// ----------------------------------
// HANDLE THE VIEW FOR A QUESTION
// ----------------------------------

import {createElementFromTemplate, closeModal} from './templates/utils.js';
import {
  polycopDivViewTemplate,
  questionViewTemplate,
  questionModalTemplate,
  questionAnswersTemplate,
  questionEditFormTemplate,
} from './templates/question-view.js';
import {updatePreview, UserRole} from './utils';

import moment from 'moment/src/moment';
import 'moment/src/locale/fr-ch';
import {baseUrl, supportEmail} from '../utils/config';
import {getAuthData} from './auth';
import axios from 'axios';
import {UserPermissions} from './user-permissions';

// Variable to keep track of the edit mode
let editMode = false;

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

async function editQuestion(questionId, form, directView, divId, questionContainer) {
  const formData = new FormData(form);

  try {
    await axios.post(`${baseUrl}/api/question/edit/${questionId}`, formData);
    // Quit the edit mode
    editMode = false;
    // Empty the question container
    questionContainer.querySelector('.question-view').remove();
    // Rerender the question
    initializeQuestionView(questionContainer, questionId, divId, directView)
  } catch (error) {
    alert('Erreur lors de l\'enregistrement de la question.');
  }
}

async function deleteQuestion(questionId, directView, questionView) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette question?')) {
    try {
      await axios.delete(`${baseUrl}/api/question/delete/${questionId}`)
      if (directView) {
        questionView.remove();
        document.querySelector('.top-bar').classList.remove('d-none');
        document.querySelector('.question-cards-wrapper').classList.remove('d-none');
      } else {
        closeModal(questionView.closest('.question-modal'));
      }
    } catch {
      alert('Erreur lors de la suppression de la question.');
    }
  }
}

function toggleEditMode(questionViewElement, questionId, directView, divId, questionContainer, enableEdit = true) {
  const titleElement = questionViewElement.querySelector('.question-title');
  const questionDate = questionViewElement.querySelector('.question-date');
  const bodyElement = questionViewElement.querySelector('.question-body');

  if (enableEdit && !editMode) {
    // Set the edit mode to true
    editMode = true;

    // Create a form
    const form = createElementFromTemplate(questionEditFormTemplate(titleElement.textContent, bodyElement.textContent));

    // Add event listeners to the form
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
      } else {
        editQuestion(questionId, form, directView, divId, questionContainer);
      }
    });

    // Add event listeners to the cancel button
    const cancelButton = form.querySelector('.cancel-button');
    cancelButton.addEventListener('click', (e) => {
      e.preventDefault();
      toggleEditMode(questionViewElement, questionId, directView, divId, questionContainer,false);
    });

    // Hide the title and body elements
    titleElement.classList.add('d-none');
    bodyElement.classList.add('d-none');
    questionDate.classList.add('d-none');

    // Append the form to the DOM
    bodyElement.after(form);
  } else {
    // Remove the form
    const form = questionViewElement.querySelector('.edit-form');
    form?.remove();

    // Show the title and body elements
    titleElement.classList.remove('d-none');
    bodyElement.classList.remove('d-none');
    questionDate.classList.remove('d-none');

    // Set the edit mode to false
    editMode = false;
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

  if (getAuthData()) {
    formData.append('question-id', questionId);

    const response = await sendAnswer(formData);

    if (response && response.status === 200) {
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
    addModalEventListeners(questionView.closest('.question-modal'));
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
      editMode = false;
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
      editMode = false;
      questionView.remove();

      document.querySelector('.top-bar').classList.remove('d-none');
      document.querySelector('.question-cards-wrapper').classList.remove('d-none');
    }
  });
}

function initializeDivPolycopView(questionView, divId) {
  if (!divId) return;

  // If divId starts with a number, escape it
  const divIdStartsWithNumber = /^\d/.test(divId);
  if (divIdStartsWithNumber) divId = `\\3${divId}`;

  const divViewPolycop = createElementFromTemplate(polycopDivViewTemplate())
  const divView = divViewPolycop.querySelector('#div-view');
  const questionDiv = document.querySelector(`#${divId} .div-container`);
  if (questionDiv) divView.appendChild(questionDiv.cloneNode(true));
  questionView.prepend(divViewPolycop);
}

function initializeQuestionOptions(questionView, userIsAuthor, questionLocked, questionId, directView, divId, questionContainer) {
  const userRole = getAuthData()?.role;
  const userIsAdmin = getAuthData()?.is_admin;

  const userPermissions = new UserPermissions({userRole, isAdmin: userIsAdmin, isAuthor: userIsAuthor});

  if (userPermissions.canViewQuestionOptions()) {
    const questionIcons = questionView.querySelector('.question-icons');
    const questionOptionsButton = createElementFromTemplate(`
        <div class="question-options">
            <div class="question-options-button" data-bs-toggle="dropdown"></div>
            <ul class="dropdown-menu">
                ${userPermissions.canEditQuestion() ? '<li><a class="dropdown-item" data-action="edit" href="#">Éditer</a></li>' : ''}
                ${userPermissions.canLockQuestion() ? `<li><a class="dropdown-item disabled" data-action="lock" href="#">${questionLocked ? 'Déverrouiller' : 'Vérrouiller'}</a></li>` : ''}
                ${userPermissions.canDeleteQuestion() ? '<li><a class="dropdown-item text-danger" data-action="delete" href="#">Supprimer</a></li>' : ''}
            </ul>
        </div>
    `);
    questionIcons.appendChild(questionOptionsButton);

    const dropdownMenu = questionView.querySelector('.dropdown-menu');

    dropdownMenu.addEventListener('click', (e) => {
      const target = e.target;

      if (target.matches('.dropdown-item[data-action="edit"]')) {
        e.preventDefault();
        if (!editMode) toggleEditMode(questionView, questionId, directView, divId, questionContainer);
      } else if (target.matches('.dropdown-item[data-action="lock"]')) {
        e.preventDefault();
        console.log('lock');
      } else if (target.matches('.dropdown-item[data-action="delete"]')) {
        e.preventDefault();
        deleteQuestion(questionId, directView, questionView);
      }
    });
  }
}

async function initializeQuestionView(questionContainer, questionId, divId, directView = false) {
  const question = await fetchQuestion(questionId);

  if (question === null) {
    // Display an error message
    const errorElement = createElementFromTemplate(`
      <div class="question-view">
        <h6>Oups...</h6>
        <p>Nous n'avons pas réussi à récupérer la question, peut-être qu'elle n'existe plus :(</p>
        <p>Si le problème persiste, n'hésitez pas à nous contacter ici: <a href="mailto:${supportEmail}?subject=Erreur lors du chargement de la question #${questionId}">${supportEmail}</a>.</p>
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

  const questionView = createElementFromTemplate(questionViewTemplate(question, getAuthData() && !question.locked));
  questionContainer.appendChild(questionView);

  await populateAnswers(questionView, questionId);

  initializeQuestionOptions(questionView, question.user_is_author, question.locked, questionId, directView, divId, questionContainer)

  initializeDivPolycopView(questionView, divId);

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
  const userPermissions = new UserPermissions({userRole: getAuthData()?.role, isAdmin: getAuthData()?.is_admin});
  answer.can_accept = userPermissions.canAcceptAnswer();

  answer.date = moment(answer.date).fromNow();
  answer.user_role = getUserRoleBadge(answer.user_role);
}

function getUserRoleBadge(role) {
  const roles = {
    [UserRole.TEACHER]: '<span class="badge text-bg-warning">Enseignant</span>',
    [UserRole.ASSISTANT]: '<span class="badge text-bg-secondary">Assistant</span>',
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
    [UserRole.TEACHER]: 1,
    [UserRole.ASSISTANT]: 2,
    [UserRole.STUDENT]: 3
  };
  return priorities[role] || 4;
}

function handleQuestionView(questionId, directView, divId) {
  // Remove existing elements if they exist
  const existingModal = document.querySelector('.question-modal');
  if (existingModal) existingModal.remove();

  const existingView = document.querySelector('#questions .question-view');
  if (existingView) existingView.remove();

  if (directView) {
    const questionContainer = document.querySelector('#questions');
    initializeQuestionView(questionContainer, questionId, divId, true);

    // Hide unnecessary UI components
    document.querySelector('.top-bar').classList.add('d-none');
    document.querySelector('.question-cards-wrapper').classList.add('d-none');
  } else {
    const questionModal = createElementFromTemplate(questionModalTemplate(questionId));
    document.body.appendChild(questionModal);
    const questionContainer = questionModal.querySelector('.content-wrapper');
    initializeQuestionView(questionContainer, questionId, divId, false);
  }
}

export {handleQuestionView};