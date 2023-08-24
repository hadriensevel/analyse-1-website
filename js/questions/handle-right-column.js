// ----------------------------------
// HANDLE RIGHT COLUMN FOR QUESTIONS
// ----------------------------------

import {loadQuestionCards} from './handle-question-card';
import {handleQuestionListModal} from './handle-question-list-modal';

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

function addQuestionIconTo(rightColumn) {
  const questionIcon = document.createElement('a');
  questionIcon.classList.add('question-right-column');
  questionIcon.href = '#';
  questionIcon.dataset.askedQuestions = '';
  rightColumn.appendChild(questionIcon);
}

function handleRightColumn() {
  // TODO: fetch the questions from the backend
  // For now, we just add a question icon to each grid-container

  const gridContainers = document.querySelectorAll('.grid-container');
  gridContainers.forEach((gridContainer) => {
    const rightColumn = createRightColumnFor(gridContainer);
    addQuestionIconTo(rightColumn);
  });

  document.body.addEventListener('click', async (e) => {
    if (e.target.matches('.question-right-column')) {
      e.preventDefault();
      const divId = e.target.parentElement.parentElement.id;
      await handleQuestionListModal(divId);
    }
  });
}

export {handleRightColumn};
