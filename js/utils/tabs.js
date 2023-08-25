// ----------------------------------
// TABS UTILS
// ----------------------------------

import {getFeatureFlag} from './feature-flags';
import {loadQuestionCards} from '../questions/handle-question-card';
import {createElementFromTemplate} from '../questions/templates/utils';
import {QuestionLocation} from '../questions/utils';

async function tabs() {
  const tabButtons = document.querySelectorAll('.exercise-tab-link');
  const tabDivs = document.querySelectorAll('.tab-div');
  let activeTabButton = document.querySelector('.exercise-tab-link.active');

  // Check the feature flag for questions
  const questionsEnabled = await getFeatureFlag('questions');
  const questionsTabDiv = document.querySelector('#questions');
  if (questionsTabDiv) {
    if (!questionsEnabled) {
      questionsTabDiv.innerHTML = '';
      const questionsDisabledElement = createElementFromTemplate(`
       <p class="questions-disabled-text">Le forum est désactivé pour le moment.</p>
    `);
      questionsTabDiv.appendChild(questionsDisabledElement);
    } else {
      // Add the placeholder divs for the questions tab
      questionsTabDiv.innerHTML = `
      <div class="question-cards-wrapper" data-direct-view="true">
          <div class="question-card-placeholder mt-2">
              <h5 class="placeholder-glow">
                  <span class="placeholder col-8"></span>
              </h5>
              <div class="placeholder-glow">
                  <span class="placeholder col-2"></span>
                  <span class="placeholder col-4"></span>
              </div>
          </div>
          <div class="question-card-placeholder mt-4">
              <h5 class="placeholder-glow">
                  <span class="placeholder col-5"></span>
              </h5>
              <div class="placeholder-glow">
                  <span class="placeholder col-3"></span>
                  <span class="placeholder col-5"></span>
              </div>
          </div>
      </div>
      `;

      // Update the badge with the number of questions
      const badge = document.querySelector('.exercise-tab-link[data-target="questions"] .questions-badge');
      // TODO: fetch the number of questions
      badge.textContent = '2';
    }
  }

  tabButtons.forEach((tabButton) => {
    tabButton.addEventListener('click', (e) => {
      e.preventDefault();

      // Remove the active class from the previously active button if it exists
      if (activeTabButton) activeTabButton.classList.remove('active');

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
      if (tabId === 'questions' && questionsEnabled) {
        loadQuestionCards('', '#questions', QuestionLocation.EXERCISE);
      }
    });
  });
}

export {tabs};