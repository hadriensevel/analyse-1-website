// ----------------------------------
// TABS UTILS
// ----------------------------------

import {handleQuestionsExercise} from '../questions/handle-questions-exercise';

function tabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabDivs = document.querySelectorAll('.tab-div');
  let activeTabButton = document.querySelector('.tab-button.active');

  // Add the placeholder divs for the questions tab
  const questionsTabDiv = document.querySelector('#questions');
  if (questionsTabDiv) {
    questionsTabDiv.innerHTML = `
    <div class="question-card-placeholder">
          <h5 class="placeholder-glow">
            <span class="placeholder col-5"></span>
        </h5>
        <div class="placeholder-glow">
            <span class="placeholder col-1"></span>
            <span class="placeholder col-3"></span>
        </div>
    </div>
    <div class="question-card-placeholder">
        <h5 class="placeholder-glow">
            <span class="placeholder col-5"></span>
        </h5>
        <div class="placeholder-glow">
            <span class="placeholder col-1"></span>
            <span class="placeholder col-3"></span>
        </div>
    </div>
    `;
  }


  tabButtons.forEach((tabButton) => {
    tabButton.addEventListener('click', (e) => {
      e.preventDefault();

      // Remove the active class from the previously active button
      activeTabButton.classList.remove('active');

      // Add the active class to the clicked button
      tabButton.classList.add('active');

      // Update the reference to the active tab button
      activeTabButton = tabButton;

      // Get the target tab ID from the data attribute
      const tabId = tabButton.dataset.target;

      // Show the target tab and hide others
      tabDivs.forEach((tabDiv) => {
        if (tabDiv.id === tabId) {
          tabDiv.classList.remove('d-none');
        } else {
          tabDiv.classList.add('d-none');
        }
      });

      // If the tab is the questions tab, load the questions
      if (tabId === 'questions') {
        handleQuestionsExercise();
      }
    });
  });
}

export {tabs};