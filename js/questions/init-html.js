// ----------------------------------
// INITIALIZE HTML
// ----------------------------------

// Get the file name of the HTML page
function getFileName() {
  const path = window.location.pathname;
  return path.split('/').pop();
}

function initHtml() {
  const gridContainers = document.querySelectorAll('.grid-container');
  gridContainers.forEach((gridContainer) => {
    const divContainer = gridContainer.querySelector('.div-container');
    if (!divContainer) {
      const gridContainerInner = gridContainer.innerHTML;
      const divContainer = document.createElement('div');
      divContainer.classList.add('div-container');
      divContainer.innerHTML = gridContainerInner;
      gridContainer.innerHTML = '';
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
    questionIcon.dataset.bsToggle = 'modal';
    questionIcon.dataset.bsTarget = '#fullscreen-modal';
    rightColumn.appendChild(questionIcon);
  });
}

export {initHtml};