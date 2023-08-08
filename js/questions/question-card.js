// ----------------------------------
// QUESTION CARD
// ----------------------------------

import {createElementFromTemplate} from '../templates/utils';
import {questionCardTemplate} from '../templates/question-modal';
import axios from 'axios';
import {baseUrl} from '../utils/config';

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

// Load the question cards to the modal and add them to the modal
function loadQuestionCards(questionId) {
  const questionCard = createElementFromTemplate(questionCardTemplate(questionId, "Définition de la limite", true, "Anonyme", "1m", 7, 28));
  const questionsModalBody = document.querySelector('.question-modal .modal-body');

  // Event listener to open the question card
  questionCard.addEventListener('click', (e) => {
    console.log("click to open");
  });

  // Remove all the children of the modal body and add the question cards
  questionsModalBody.innerHTML = '';
  questionsModalBody.appendChild(questionCard);
}

export {loadQuestionCards};
