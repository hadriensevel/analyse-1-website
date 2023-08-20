// ----------------------------------
// HANDLE THE QUESTION CARDS IN MODAL
// ----------------------------------

import {createElementFromTemplate} from './templates/utils';
import {questionCardTemplate} from './templates/question-card';
import {handleQuestionModal} from './handle-question-modal';

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

function renderQuestions(questions, questionsModalBody) {
  questionsModalBody.innerHTML = '';

  questions.forEach((question) => {
    const questionCard = createElementFromTemplate(questionCardTemplate(question.id, question.title, question.resolved, question.author, question.date, question.comments, question.likes));
    questionsModalBody.appendChild(questionCard);
  });

  // Use event delegation to handle click events on question cards
  questionsModalBody.addEventListener('click', (e) => {
    const questionCard = e.target.closest('.question-card');
    if (questionCard) {
      handleQuestionModal(questionCard.dataset.questionId)
      new bootstrap.Modal(document.querySelector('.question-modal')).show();
    }
  });
}

// Load the question cards to the modal and add them to the modal
async function loadQuestionCards(divId, questionsBody) {
  // Mock questions
  const questions = [
    {
      id: 1,
      title: 'Définition de la limite',
      resolved: true,
      author: '',
      date: '4j',
      comments: 7,
      likes: 28,
    },
    {
      id: 2,
      title: 'G pa compri koman on fé',
      resolved: false,
      author: '',
      date: '1m',
      comments: 0,
      likes: 2,
    }];
  //const questions = [];
  //const questions = await fetchQuestions(divId);


  // Add some delay to simulate a real request
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const questionsBodyElement = document.querySelector(questionsBody);

  if (questions.length) {
    renderQuestions(questions, questionsBodyElement);
  } else {
    questionsBodyElement.innerHTML = '<p class="text-center">Aucune question n\'a été posée pour le moment.</p>';
  }
}

export {loadQuestionCards};
