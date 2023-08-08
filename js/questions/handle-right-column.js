// ----------------------------------
// HANDLE RIGHT COLUMN FOR QUESTIONS
// ----------------------------------

import {loadQuestionCards} from './handle-question-card';
import {handleQuestionListModal} from './handle-question-list-modal';

// Get the file name of the HTML page
function getFileName() {
  const path = window.location.pathname;
  return path.split('/').pop();
}

function handleRightColumn() {
  // TODO: fetch the questions from the backend
  // For now, we just add a question icon to each grid-container

  const gridContainers = document.querySelectorAll('.grid-container');
  gridContainers.forEach((gridContainer) => {
    if (!gridContainer.querySelector('.div-container')) {
      const divContainer = document.createElement('div');
      divContainer.classList.add('div-container');
      while (gridContainer.firstChild) divContainer.appendChild(gridContainer.firstChild);
      gridContainer.appendChild(divContainer);
      const rightColumn = document.createElement('div');
      rightColumn.classList.add('right-column');
      gridContainer.appendChild(rightColumn);
    }
    const rightColumn = gridContainer.querySelector('.right-column');
    const questionIcon = document.createElement('a');
    questionIcon.classList.add('question-right-column');
    questionIcon.href = '#';
    questionIcon.dataset.askedQuestions = '';
    rightColumn.appendChild(questionIcon);

    questionIcon.addEventListener('click', (e) => {
      e.preventDefault();
      const divId = questionIcon.parentElement.parentElement.id;
      handleQuestionListModal(divId)
      const questionListModal = new bootstrap.Modal(document.querySelector('.question-list-modal'));
      questionListModal.show();
      loadQuestionCards(divId);
    });
  });
}

export {handleRightColumn};
