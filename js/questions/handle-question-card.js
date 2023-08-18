// ----------------------------------
// HANDLE THE QUESTION CARDS IN MODAL
// ----------------------------------

import {createElementFromTemplate} from '../templates/utils';
import axios from 'axios';
import {baseUrl} from '../utils/config';
import {questionCardTemplate} from '../templates/question-card';

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
  /*const questions = [
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
    }];*/
  const questions = [];
  //const questions = await fetchQuestions(questionId);


  // Add some delay to simulate a real request
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const questionsModalBody = document.querySelector('.question-list-modal .modal-body');
  questionsModalBody.innerHTML = '';

  // If there are no questions, display a message
  if (questions.length === 0) {
    questionsModalBody.innerHTML = '<p class="text-center">Aucune question n\'a été posée pour le moment.</p>';
    return;
  }

  // Iterate through the questions and add them to the modal
  questions.forEach((question) => {
    const questionCard = createElementFromTemplate(questionCardTemplate(question.id, question.title, question.resolved, question.author, question.date, question.comments, question.likes));

    // Event listener to open the question card
    questionCard.addEventListener('click', (e) => {
      // TODO
    });

    // Add the question card to the modal
    questionsModalBody.appendChild(questionCard);
  });
}

export {loadQuestionCards};
