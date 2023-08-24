// ----------------------------------
// HANDLE THE QUESTION CARDS IN MODAL
// ----------------------------------

import {createElementFromTemplate} from './templates/utils';
import {questionCardTemplate} from './templates/question-card';
import {handleQuestionModal} from './handle-question-modal';
import {handleNewQuestionModal} from './handle-new-question-modal';
import {noQuestionMessages} from './no-question-messages';
import {Sort} from './utils';
import {getFeatureFlag} from '../utils/feature-flags';
import {getAuthData} from './auth';

import axios from 'axios';
import {baseUrl} from '../utils/config';
import moment from 'moment/src/moment';
import 'moment/src/locale/fr-ch';

async function fetchQuestions(divId) {
  try {
    const response = await axios.get(`${baseUrl}/api/question/polycop-div/${divId}`, {
      headers: {
        Accept: 'application/json',
      },
    });
    return response.data;
  } catch {
    return null;
  }
}

function renderQuestions(questions, questionCardsWrapper, sort = Sort.DATE) {
  if (questions.length) {
    // Moment.js is used to format the date
    moment.locale('fr-ch');

    // Sort the questions (by default, by date)
    if (sort === Sort.LIKES) questions.sort((a, b) => b.likes - a.likes);
    else if (sort === Sort.DATE) questions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Clear the questions body (placeholder and questions)
    questionCardsWrapper.innerHTML = '';

    // Add the questions to the questions body
    questions.forEach((question) => {
      // Convert the date to a relative date
      const date = moment(question.date).fromNow();
      // Create the question card
      const questionCard = createElementFromTemplate(questionCardTemplate(question.id, question.title, question.resolved, question.author, date, question.comments, question.likes));
      questionCardsWrapper.appendChild(questionCard);
    });

    // Render LaTeX
    renderMathInElement(questionCardsWrapper);

    // Use event delegation to handle click events on question cards
    questionCardsWrapper.addEventListener('click', (e) => {
      const questionCard = e.target.closest('.question-card');
      if (questionCard) {
        handleQuestionModal(questionCard.dataset.questionId)
        new bootstrap.Modal(document.querySelector('.question-modal')).show();
      }
    });
  } else {
    // If there are no questions, take a message randomly from the list and
    // display it and the associated image.
    const randomIndex = Math.floor(Math.random() * noQuestionMessages.length);
    const noQuestionMessage = noQuestionMessages[randomIndex];
    // If there's already a message, don't display another one
    if (questionCardsWrapper.querySelector('.no-question')) return;
    // Display the message
    questionCardsWrapper.innerHTML = `
      <div class="no-question container-md h-100">
         <div class="row h-100">
            <div class="d-flex flex-column flex-md-row align-items-center justify-content-center h-100">
                <img src="../../media/images/no-question/${noQuestionMessage.image}" class="mb-2 mb-md-0 mr-md-2 img-fluid" width="300">
                 <p class="text-secondary text-center text-md-start">${noQuestionMessage.message}</p>
            </div>
        </div>
     </div>
    `;
  }
}

// Load the question cards to the modal and add them to the modal
async function loadQuestionCards(divId, questionsBody, questionType) {
  // Mock questions
  const questions = [
    {
      id: 1,
      title: 'Définition de la limite \\( \\lim_{x \\to 0} \\frac{\\sin x}{x} \\)',
      resolved: true,
      author: '',
      date: '2023-06-20T12:00:44.541Z',
      comments: 7,
      likes: 28,
    },
    {
      id: 2,
      title: 'G pa compri koman on fé',
      resolved: false,
      author: '',
      date: '2023-08-21T06:34:23.541Z',
      comments: 0,
      likes: 2,
    }];
  //const questions = [];

  // Get the questions body element
  const questionsBodyElement = document.querySelector(questionsBody);

  // Check the feature flag and authentication for new questions
  let newQuestion = false;
  const newQuestionEnabled = await getFeatureFlag('newQuestion');
  if (newQuestionEnabled) {
    // Check if the user is authenticated
    const authData = getAuthData();
    //newQuestion = authData !== null;
    newQuestion = true;
  }

  // Add the top bar with the sort dropdown
  if (!questionsBodyElement.querySelector('.top-bar')) {
    const topBar = createElementFromTemplate(`
    <div class="top-bar">
        <div>
            Trier par:
            <button class="sort-dropdown" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                Date
            </button>
            <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#">Date</a></li>
                <li><a class="dropdown-item" href="#">Likes</a></li>
            </ul>
        </div>
        <div class="new-question"></div>
    </div>
    `);
    questionsBodyElement.prepend(topBar);

    // Add the event listener to the sort dropdown and the dropdown items
    // (when click on the dropdown, the dropdown items are shown. When click on
    // a dropdown item, the dropdown items are hidden and the dropdown button
    // text is changed)
    const sortDropdown = topBar.querySelector('.sort-dropdown');
    const dropdownItems = topBar.querySelectorAll('.dropdown-item');
    sortDropdown.addEventListener('click', () => {
      dropdownItems.forEach((dropdownItem) => {
        dropdownItem.addEventListener('click', (e) => {
          e.preventDefault();
          sortDropdown.textContent = dropdownItem.textContent;
          renderQuestions(questions, questionCardsWrapper, dropdownItem.textContent === 'Date' ? Sort.DATE : Sort.LIKES);
        });
      });
    });
  }

  // If the feature flag is enabled, the user is authenticated, and if there is not
  // already a new question button, add it to the top bar
  if (newQuestion && !questionsBodyElement.querySelector('.new-question-button')) {
    const newQuestionButton = createElementFromTemplate(`
    <button type="button" class="new-question-button">Nouvelle question</button>
    `);
    questionsBodyElement.querySelector('.top-bar .new-question').appendChild(newQuestionButton);

    // Add the event listener to the new question button
    newQuestionButton.addEventListener('click', () => {
      handleNewQuestionModal(divId, questionType);
      new bootstrap.Modal(document.querySelector('.new-question-modal')).show();
    });
  }

  // Add some delay to simulate a real request
  //await new Promise((resolve) => setTimeout(resolve, 1000));

  // Get the questions from the backend
  //const questions = await fetchQuestions(divId);

  // Get the questions wrapper
  const questionCardsWrapper = questionsBodyElement.querySelector('.question-cards-wrapper');

  // Render the questions
  renderQuestions(questions, questionCardsWrapper);
}

export {loadQuestionCards};
