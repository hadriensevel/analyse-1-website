// ----------------------------------
// TABS UTILS
// ----------------------------------

import {getFeatureFlag} from './feature-flags';
import {questionCardsWrapperTemplate} from '../questions/templates/question-cards-wrapper';
import {loadQuestionCards} from '../questions/handle-question-card';
import {createElementFromTemplate} from '../questions/templates/utils';
import {getFileName, QuestionLocation} from '../questions/utils';
import {baseUrl} from './config';

import axios from 'axios';

async function fetchNumberOfQuestions() {
  const page = getFileName();
  try {
    const response = await axios.get(`${baseUrl}/api/get-questions-count/${page}`, {
      headers: {
        Accept: 'application/json',
      }
    });
    return response.data.questions_count;
  } catch {
    return null;
  }
}

async function tabs() {
  const tabButtons = document.querySelectorAll('.exercise-tab-item');
  const tabDivs = document.querySelectorAll('.tab-div');
  let activeTabButton = document.querySelector('.exercise-tab-item.active');

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
      const questionCardsWrapper = createElementFromTemplate(questionCardsWrapperTemplate(true));
      questionsTabDiv.appendChild(questionCardsWrapper);

      // Update the badge with the number of questions
      const badge = document.querySelector('.exercise-tab-link[data-target="questions"] .questions-badge');
      badge.textContent = await fetchNumberOfQuestions();
    }
  }

  tabButtons.forEach((tabButton) => {
    tabButton.addEventListener('click', (e) => {
      e.preventDefault();

      // Check if the clicked button is already active
      const wasAlreadyActive = tabButton.classList.contains('active');

      // Remove the active class from the previously active button if it exists
      if (activeTabButton) activeTabButton.classList.remove('active');

      // Get the target tab ID from the data attribute
      const tabLink = tabButton.querySelector('.exercise-tab-link');
      const tabId = tabLink.dataset.target;

      // If the button was already active, hide its content and return
      if (wasAlreadyActive) {
        e.currentTarget.blur();  // remove focus from the button
        document.getElementById(tabId).classList.add('d-none'); // hide the tab
        activeTabButton = null;  // set the reference to null since no tab button is active now
        return;  // exit from the function
      }

      // Otherwise, proceed as before:

      // Add the active class to the clicked button
      tabButton.classList.add('active');

      // Update the reference to the active tab button
      activeTabButton = tabButton;

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
        loadQuestionCards('#questions', QuestionLocation.EXERCISE);
      }
    });
  });
}

export {tabs};