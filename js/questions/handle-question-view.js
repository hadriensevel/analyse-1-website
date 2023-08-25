// ----------------------------------
// HANDLE THE VIEW FOR A QUESTION
// ----------------------------------

import {createElementFromTemplate, closeModal} from './templates/utils.js';
import {questionViewTemplate, questionModalTemplate} from "./templates/question-view.js";

import moment from 'moment/src/moment';
import 'moment/src/locale/fr-ch';

function addDirectViewEventListeners(questionView, questionId) {
  const topBar = document.createElement('div');
  topBar.classList.add('top-bar');
  topBar.innerHTML = `
    <a class="back-button" href="#" aria-label="Retour"></a>
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

function initializeQuestionView(questionContainer, questionId, directView) {
  // Get the question data
  // TODO: fetch the question data from the API
  // Mock data
  const questionData = {
    id: questionId,
    title: 'G pa compri koman on fé',
    resolved: true,
    date: '2023-08-21T06:34:23.541Z',
    body: 'G pa compri pkoi pour certaines fonctions on di k\'elles sont continu partout et pour d\'autres just à certains endroits. Et koman on détermine ces points de discontinuité? Tu peu m\'expliké tout ça en détail stp?',
    image: '',
    likes: 17,
    answers: [],
  }

  // Moment.js is used to format the date
  moment.locale('fr-ch');
  // Convert the date to a relative date
  questionData.date = moment(questionData.date).fromNow();

  // Add the question view
  const questionView = createElementFromTemplate(questionViewTemplate(questionData));
  questionContainer.appendChild(questionView, questionId);

  if (directView) {
    addDirectViewEventListeners(questionView, questionId);
  } else {
    //addModalEventListeners(questionView);
  }

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
    const questionModal = createElementFromTemplate(questionModalTemplate());
    document.body.appendChild(questionModal);
    const questionContainer = questionModal.querySelector('.content-wrapper');
    initializeQuestionView(questionContainer, questionId, false);
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