// ----------------------------------
// INITIALIZE HTML
// ----------------------------------

// Get the file name of the HTML page
function getFileName() {
  const path = window.location.pathname;
  return path.split('/').pop();
}

function initRightColumn() {
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
    questionIcon.href = '#questions-modal';
    questionIcon.dataset.askedQuestions = '';
    questionIcon.dataset.bsToggle = 'modal';
    rightColumn.appendChild(questionIcon);

    questionIcon.addEventListener('click', (e) => {
      e.preventDefault();
      console.log(questionIcon.parentElement.parentElement.id);
    });
  });
}

export {initRightColumn};
