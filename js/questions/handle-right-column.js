// ----------------------------------
// HANDLE RIGHT COLUMN FOR QUESTIONS
// ----------------------------------

import {handleQuestionListModal} from './handle-question-list-modal';
import {getFileName} from './utils';
import {baseUrl} from '../utils/config';

import axios from 'axios';

async function fetchQuestionsCountDivs(page) {
  try {
    const response = await axios.get(`${baseUrl}/api/get-questions-count-divs/${page}`, {
      headers: {
        Accept: 'application/json',
      }
    });
    return response.data;
  } catch {
    return null;
  }
}

function createRightColumnFor(gridContainer) {
  if (!gridContainer.querySelector('.div-container')) {
    const divContainer = document.createElement('div');
    divContainer.classList.add('div-container');

    while (gridContainer.firstChild) divContainer.appendChild(gridContainer.firstChild);
    gridContainer.appendChild(divContainer);

    const rightColumn = document.createElement('div');
    rightColumn.classList.add('right-column');
    gridContainer.appendChild(rightColumn);
  }
  return gridContainer.querySelector('.right-column');
}

function addQuestionIconTo(rightColumn, count) {
  const questionIcon = document.createElement('a');
  questionIcon.classList.add('question-right-column');
  questionIcon.href = '#';
  if (count) {
    questionIcon.dataset.askedQuestions = count;
  }
  rightColumn.appendChild(questionIcon);
}

async function handleRightColumn() {
  const page = getFileName();
  const questionsCount = await fetchQuestionsCountDivs(page);

  const gridContainers = document.querySelectorAll('.grid-container');
  gridContainers.forEach((gridContainer) => {
    // Get the number of questions for the current div
    let count = 0;
    if (questionsCount) {
      const divData = questionsCount.find(item => item.div_id === gridContainer.id);
      count = divData ? divData.questions_count : 0;
    }
    const rightColumn = createRightColumnFor(gridContainer);
    addQuestionIconTo(rightColumn, count);
  });

  document.body.addEventListener('click', async (e) => {
    if (e.target.matches('.question-right-column')) {
      e.preventDefault();
      const divId = e.target.parentElement.parentElement.id;
      const count = e.target.dataset.askedQuestions ?? 0;
      await handleQuestionListModal(divId, count);
    }
  });
}

export {handleRightColumn};
