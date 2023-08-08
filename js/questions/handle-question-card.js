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
async function loadQuestionCards(questionId) {
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

  // Add some delay to simulate a real request
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const questionsModalBody = document.querySelector('.question-modal .modal-body');
  questionsModalBody.innerHTML = '';

  // Iterate through the questions and add them to the modal
  questions.forEach((question) => {
    const questionCard = createElementFromTemplate(questionCardTemplate(question.id, question.title, question.resolved, question.author, question.date, question.comments, question.likes));

    // Event listener to open the question card
    questionCard.addEventListener('click', (e) => {
      console.log('click to open');
    });

    // Add the question card to the modal
    questionsModalBody.appendChild(questionCard);
  });
}

export {loadQuestionCards};
