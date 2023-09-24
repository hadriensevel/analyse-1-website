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
  answerEditFormTemplate,
} from './templates/question-view.js';
import {QuestionLocation, updatePreview, UserRole} from './utils';
import {processLineBreaks} from './utils';

import moment from 'moment/src/moment';
import 'moment/src/locale/fr-ch';
import {baseUrl, supportEmail} from '../utils/config';
import {getAuthData} from '../utils/auth';
import axios from 'axios';
import {UserPermissions} from './user-permissions';
import {rightIframeLink} from '../utils/right-iframe-link';
import {scrollToSavedPosition} from './handle-question-card';

async function sendLike(questionId, like, answer = false) {
  const endpoint = like ? 'add' : 'remove';
  const method = like ? 'post' : 'delete';
  axios[method](`${baseUrl}/api/like/${endpoint}${answer ? '-answer' : ''}/${questionId}`);
}

// Fetch the question data from the API with axios
async function fetchQuestion(questionId) {
  try {
    const response = await axios.get(`${baseUrl}/api/question/get/${questionId}`, {
      headers: {
        Accept: 'application/json',
      }
    });
    return response.data.question;
  } catch {
    return null;
  }
}

async function editQuestion(questionViewElement, questionId) {
  const questionBody = questionViewElement.querySelector('.question-body');
  const questionHeader = questionViewElement.querySelector('.question-header');

  // Create a form
  const form = createElementFromTemplate(questionEditFormTemplate(questionBody.dataset.body));

  // Add event listeners to the form
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add('was-validated');
    } else {
      const formData = new FormData(form);

      // Add a spinner to the submit button
      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.setAttribute('disabled', '');
      submitButton.classList.add('sending');
      const submitButtonContent = submitButton.innerHTML;
      submitButton.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span role="status">Envoi...</span>
      `;

      try {
        await axios.post(`${baseUrl}/api/question/edit/${questionId}`, formData);

        // Replace the question body with the new body
        questionBody.innerHTML = processLineBreaks(formData.get('question-body'));
        questionBody.dataset.body = formData.get('question-body');

        // Remove the form and show the body and header elements
        form.remove();
        questionBody.classList.remove('d-none');
        questionHeader.classList.remove('d-none');

        renderMathInElement(questionBody);
      } catch (error) {
        alert('Erreur lors de l\'enregistrement de la question.');

        // Remove the spinner from the submit button
        submitButton.removeAttribute('disabled');
        submitButton.classList.remove('sending');
        submitButton.innerHTML = submitButtonContent;
      }
    }
  });

  // Add event listeners to the cancel button
  const cancelButton = form.querySelector('.cancel-button');
  cancelButton.addEventListener('click', (e) => {
    e.preventDefault();

    // Remove the form and show the body and header elements
    form.remove();
    questionBody.classList.remove('d-none');
    questionHeader.classList.remove('d-none');
  });

  // Add event listener on the textarea to update the preview
  const textarea = form.querySelector('textarea');
  textarea.addEventListener('input', () => {
    updatePreview(textarea, form.querySelector('.preview'), form.querySelector('.preview-body'), form.querySelector('.preview-text'));
  });

  // Hide the header and body elements
  questionHeader.classList.add('d-none');
  questionBody.classList.add('d-none');

  // Append the form to the DOM
  questionBody.after(form);
}

async function deleteQuestion(questionId, directView, questionView) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette question?')) {
    try {
      await axios.delete(`${baseUrl}/api/question/delete/${questionId}`);
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

// async function lockQuestion(questionView, questionId) {
// }

async function editAnswer(answerElement, questionId, answerId) {
  const answerBody = answerElement.querySelector('.answer-body');
  const answerFooter = answerElement.querySelector('.answer-footer');

  // Create a form
  const form = createElementFromTemplate(answerEditFormTemplate(answerElement.dataset.body));

  // Add event listeners to the form
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add('was-validated');
    } else {
      const formData = new FormData(form);

      // Add a spinner to the submit button
      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.setAttribute('disabled', '');
      submitButton.classList.add('sending');
      const submitButtonContent = submitButton.innerHTML;
      submitButton.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span role="status">Envoi...</span>
      `;

      try {
        await axios.post(`${baseUrl}/api/answer/edit/${answerId}`, formData);

        // Replace the answer body with the new body
        answerBody.innerHTML = processLineBreaks(formData.get('answer-body'));
        answerBody.dataset.body = formData.get('answer-body');

        // Remove the form and show the body and footer elements
        form.remove();
        answerBody.classList.remove('d-none');
        answerFooter.classList.remove('d-none');

        renderMathInElement(answerBody);
      } catch {
        alert('Erreur lors de l\'enregistrement de la réponse.');

        // Remove the spinner from the submit button
        submitButton.removeAttribute('disabled');
        submitButton.classList.remove('sending');
        submitButton.innerHTML = submitButtonContent;
      }
    }
  });

  // Add event listeners to the cancel button
  const cancelButton = form.querySelector('.cancel-button');
  cancelButton.addEventListener('click', (e) => {
    e.preventDefault();
    form.remove();
    answerBody.classList.remove('d-none');
    answerFooter.classList.remove('d-none');
  });

  // Add event listener on the textarea to update the preview
  const textarea = form.querySelector('textarea');
  textarea.addEventListener('input', () => {
    updatePreview(textarea, form.querySelector('.preview'), form.querySelector('.preview-body'), form.querySelector('.preview-text'));
  });

  // Hide the body and footer elements
  answerBody.classList.add('d-none');
  answerFooter.classList.add('d-none');

  // Append the form to the DOM
  answerBody.before(form);
}

async function deleteAnswer(answerElement, answerId) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette réponse?')) {
    try {
      await axios.delete(`${baseUrl}/api/answer/delete/${answerId}`);
      answerElement.remove();

      // Update the answer count
      const answerCountElement = document.querySelector('.count-answers');
      const answerCount = parseInt(answerCountElement.textContent);
      answerCountElement.textContent = answerCount - 1;
    } catch {
      alert('Erreur lors de la suppression de la réponse.');
    }
  }
}

async function acceptAnswer(answerElement, answerId) {
  const answerAcceptedElement = answerElement.querySelector('.answer-accepted');
  const accepted = answerAcceptedElement.dataset.accepted === 'true';

  try {
    await axios.post(`${baseUrl}/api/answer/${accepted ? 'unaccept' : 'accept'}/${answerId}`);

    answerAcceptedElement.dataset.accepted = accepted ? 'false' : 'true';

    // Update the dropdown menu
    const dropdownMenu = answerElement.querySelector('.dropdown-menu');
    const acceptButton = dropdownMenu.querySelector('.dropdown-item[data-action="accept"]');
    acceptButton.textContent = accepted ? 'Valider la réponse' : 'Invalider la réponse';
  } catch {
    alert('Erreur lors de la mise à jour de la réponse.');
  }
}

function showToast(toastElement, toastOptions = {delay: 5000}) {
  const toast = new bootstrap.Toast(toastElement, toastOptions);
  toast.show();
}

async function handleAnswerFormSubmission(elements) {
  const {
    form,
    questionId,
    previewBodyText,
    preview,
    questionView
  } = elements;
  const formData = new FormData(form);

  // Add a spinner to the submit button
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.setAttribute('disabled', '');
  submitButton.classList.add('sending');
  const submitButtonContent = submitButton.innerHTML;
  submitButton.innerHTML = `
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    <span role="status">Envoi...</span>
  `;

    formData.append('question-id', questionId);

  try {
    await axios.post(`${baseUrl}/api/answer/new`, formData);

    form.reset();
    previewBodyText.textContent = '';
    preview.classList.add('d-none');
    form.classList.remove('was-validated');

    // Rerender the question
    await populateAnswers(questionView, questionId);

    // Update the answer count
    const answerCountElement = questionView.querySelector('.count-answers');
    const answerCount = parseInt(answerCountElement.textContent);
    answerCountElement.textContent = answerCount + 1;

    // Remove the spinner from the submit button
    submitButton.removeAttribute('disabled');
    submitButton.classList.remove('sending');
    submitButton.innerHTML = submitButtonContent;
  } catch {
    alert('Erreur lors de l\'envoi de la réponse.');

    // Remove the spinner from the submit button
    submitButton.removeAttribute('disabled');
    submitButton.classList.remove('sending');
    submitButton.innerHTML = submitButtonContent;
  }
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
      handleAnswerFormSubmission(elements);
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

function addAnswerLikeEventListener(answerContainer) {
  if (getAuthData()) {

    // Add clickable class to all the like buttons
    const likeButtons = answerContainer.querySelectorAll('.answer-likes');
    likeButtons.forEach((likeButton) => {
      likeButton.classList.add('clickable');
    });

    // Add the event listener to the like buttons
    answerContainer.addEventListener('click', (e) => {
      const target = e.target;

      // Get the answer id
      const answerId = target.closest('.answer').dataset.answerId;

      if (target.matches('.answer-likes')) {
        e.preventDefault();
        e.stopPropagation();

        const likeCountValue = parseInt(target.textContent);

        if (target.classList.contains('liked')) {
          target.textContent = likeCountValue - 1;
          target.classList.remove('liked');
          sendLike(answerId, false, true);
        } else {
          target.textContent = likeCountValue + 1;
          target.classList.add('liked');
          sendLike(answerId, true, true);
        }
      }
    });
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
    <div class="question-link"></div>
  `;

  questionView.prepend(topBar);
  topBar.addEventListener('click', (e) => {
    if (e.target.classList.contains('back-button')) {
      e.preventDefault();
      questionView.remove();

      document.querySelector('.top-bar').classList.remove('d-none');
      document.querySelector('.question-cards-wrapper').classList.remove('d-none');
      scrollToSavedPosition();
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

function initializeQuestionOptions(questionView, userIsAuthor, questionLocked, questionId, directView) {
  const dropdownMenu = questionView.querySelector('.dropdown-menu');

  if (!dropdownMenu) return;
  dropdownMenu.addEventListener('click', (e) => {
    const target = e.target;

    if (target.matches('.dropdown-item[data-action="edit"]')) {
      e.preventDefault();
      editQuestion(questionView, questionId);
    } else if (target.matches('.dropdown-item[data-action="lock"]')) {
      e.preventDefault();
      //lockQuestion(questionView, questionId);
    } else if (target.matches('.dropdown-item[data-action="delete"]')) {
      e.preventDefault();
      deleteQuestion(questionId, directView, questionView);
    }
  });
}

function initializeQuestionLink(questionView, page, divId, location, sectionName) {
  const link = location === 'course' ? `../../analyse-1/resources/sections/${page}.html?div=${divId}` : `${window.parent.location.pathname}?page=${page}`;

  // Add the name of the section to the top bar
  const topBarLink = questionView.querySelector('.top-bar > .question-link');
  const sectionTitleElement = document.createElement('span');
  sectionTitleElement.textContent = sectionName ? ` - ${sectionName}` : '';

  // Add the link to the top bar
  const linkElement = document.createElement('a');
  if (location === 'course') linkElement.classList.add('right-iframe-link');
  else linkElement.target = '_blank';
  linkElement.href = link;

  topBarLink.appendChild(sectionTitleElement);
  topBarLink.appendChild(linkElement);

  renderMathInElement(topBarLink);

  rightIframeLink();
}

async function initializeQuestionView(questionContainer, questionId, questionLocation, divId, directView = false) {
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

  // Initialize permissions for the current user
  const userRole = getAuthData()?.role;
  const userIsAdmin = getAuthData()?.is_admin;
  const userPermissions = new UserPermissions({userRole, isAdmin: userIsAdmin, isAuthor: question.user_is_author});
  question.can_edit = userPermissions.canEditQuestion();
  question.can_delete = userPermissions.canDeleteQuestion();
  question.can_lock = userPermissions.canLockQuestion();

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

  if (questionLocation !== QuestionLocation.COURSE && questionLocation !== QuestionLocation.EXERCISE) {
    initializeQuestionLink(questionView, question.page_id, question.div_id, question.location, question.section_name);
  }
}

async function populateAnswers(questionView, questionId) {
  // Clear existing answers
  const answersContainer = questionView.querySelector('.answers');
  while (answersContainer.firstChild) {
    answersContainer.firstChild.remove();
  }

  const question = await fetchQuestion(questionId);
  const answers = question.answers;

  // Initialize permissions for the current user
  const userRole = getAuthData()?.role;
  const userIsAdmin = getAuthData()?.is_admin;

  sortAnswers(answers).forEach(answer => {
    // Initialize permissions for the current answer
    const userPermissions = new UserPermissions({userRole, isAdmin: userIsAdmin, isAuthor: answer.user_is_author});
    answer.can_edit = userPermissions.canEditAnswer();
    answer.can_delete = userPermissions.canDeleteAnswer();
    answer.can_accept = userPermissions.canAcceptAnswer();

    // Format the answer data
    answer.date = moment(answer.date).fromNow();
    answer.user_badge = getUserBadge(answer.user_role, answer.is_op);
    answer.formatted_body = processLineBreaks(answer.body);

    const answerElement = createElementFromTemplate(questionAnswersTemplate(answer, question.locked));
    answersContainer.appendChild(answerElement);

    initializeAnswerOptions(answerElement, questionId, answer.accepted);
  });

  // Add the event listener for the likes of the answers
  addAnswerLikeEventListener(answersContainer);

  renderMathInElement(answersContainer);
}

function initializeAnswerOptions(answerElement, questionId) {
  const dropdownMenu = answerElement.querySelector('.dropdown-menu');

  if (!dropdownMenu) return;
  dropdownMenu.addEventListener('click', (e) => {
    const target = e.target;
    const answerId = answerElement.dataset.answerId;

    if (target.matches('.dropdown-item[data-action="edit"]')) {
      e.preventDefault();
      editAnswer(answerElement, questionId, answerId);
    } else if (target.matches('.dropdown-item[data-action="accept"]')) {
      e.preventDefault();
      acceptAnswer(answerElement, answerId);
    } else if (target.matches('.dropdown-item[data-action="delete"]')) {
      e.preventDefault();
      deleteAnswer(answerElement, answerId);
    }
  });
}

function formatQuestionData(question) {
  moment.locale('fr-ch');
  question.formatted_body = processLineBreaks(question.body);
  question.date = moment(question.date).fromNow();
  question.image = question.image ?
    `<img class="question-image" src="${baseUrl}/api/image/${question.image}" alt="Image de la question">` :
    '';
}

function getUserBadge(role, isOp) {
  const roles = {
    [UserRole.TEACHER]: '<span class="badge text-bg-warning">Enseignant</span>',
    [UserRole.ASSISTANT]: '<span class="badge text-bg-secondary">Assistant</span>',
    [UserRole.STUDENT]: isOp ? '<span class="badge text-bg-light">Auteur original</span>' : '',
  };
  return roles[role] || '';
}

function sortAnswers(answers) {
  return answers.sort((a, b) => {
    //if (a.accepted !== b.accepted) return b.accepted - a.accepted;
    //if (a.user_role !== b.user_role) return rolesPriority(a.user_role) - rolesPriority(b.user_role);
    return new Date(a.date) - new Date(b.date);
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

function handleQuestionView(questionId, questionLocation, directView, divId) {
  // Remove existing elements if they exist
  const existingModal = document.querySelector('.question-modal');
  if (existingModal) existingModal.remove();

  const existingView = document.querySelector('.question-view');
  if (existingView) existingView.remove();

  if (directView) {
    const questionContainer = document.querySelector('#questions, #all-questions, #my-questions, #general-questions');
    initializeQuestionView(questionContainer, questionId, questionLocation, divId, true);

    // Hide unnecessary UI components
    document.querySelector('.top-bar').classList.add('d-none');
    document.querySelector('.question-cards-wrapper').classList.add('d-none');
  } else {
    const questionModal = createElementFromTemplate(questionModalTemplate(questionId));
    document.body.appendChild(questionModal);
    const questionContainer = questionModal.querySelector('.content-wrapper');
    initializeQuestionView(questionContainer, questionId, QuestionLocation.COURSE, divId, false);
  }
}

export {handleQuestionView};