// ----------------------------------
// HANDLE THE QUESTION CARDS IN MODAL
// ----------------------------------

import {createElementFromTemplate} from './templates/utils';
import {
    newQuestionButtonTemplate,
    questionCardsPlaceholderTemplate,
    questionCardsTopBarTemplate
} from './templates/question-cards-wrapper';
import {
    questionCardTemplate,
    noQuestionsMessageTemplate,
    errorMessageTemplate,
    paginationTemplate
} from './templates/question-card';
import {handleQuestionView} from './handle-question-view';
import {handleNewQuestionView} from './handle-new-question-view';
import {getFileName, QuestionLocation, Sort} from './utils';
import {getFeatureFlag} from '../utils/feature-flags';
import {getAuthData} from '../utils/auth';

import axios from 'axios';
import {baseUrl, supportEmail} from '../utils/config';
import moment from 'moment/src/moment';
import 'moment/src/locale/fr-ch';

let currentQuestions = [];
let currentSort = Sort.DATE;
let currentPage = 1;
let savedScrollPosition = 0;
let numberOfPages;

// Utility functions for sorting
const sortFunctions = {
    [Sort.DATE]: (a, b) => new Date(b.date) - new Date(a.date),
    [Sort.LIKES]: (a, b) => b.likes - a.likes || new Date(b.date) - new Date(a.date),
    [Sort.RESOLVED]: (a, b) => b.resolved - a.resolved || new Date(b.date) - new Date(a.date),
    [Sort.NON_RESOLVED]: (a, b) => a.resolved - b.resolved || new Date(b.date) - new Date(a.date),
    [Sort.ANSWERS]: (a, b) => b.answers - a.answers || new Date(b.date) - new Date(a.date),
    [Sort.NO_ANSWER]: (a, b) => a.answers - b.answers || new Date(b.date) - new Date(a.date),
    [Sort.LAST_ACTIVITY]: (a, b) => new Date(b.last_activity) - new Date(a.last_activity) || new Date(b.date) - new Date(a.date),
};

// Fetch the questions from the backend
async function fetchQuestions(questionLocation, pageId, divId, page, sort, showBookmarks) {
    let url = (() => {
        if (questionLocation === QuestionLocation.ALL_QUESTIONS) {
            return `${baseUrl}/api/get-questions/all-questions`;
        } else if (questionLocation === QuestionLocation.MY_QUESTIONS) {
            return `${baseUrl}/api/get-questions/my-questions`;
        } else {
            return `${baseUrl}/api/get-questions/${pageId}${divId ? `/${divId}` : ''}`;
        }
    })();

    // Add the page and sort parameters if needed
    const usePage = page && page > 0;
    if (usePage) {
        url += `?page=${page}`;
    }

    if (sort) {
        url += usePage ? `&sort=${sort}` : `?sort=${sort}`;
    }
    
    if (showBookmarks) {
        url += usePage || sort ? '&bookmarked-questions=true' : '?bookmarked-questions=true';
    }

    try {
        const response = await axios.get(url, {
            headers: {
                Accept: 'application/json',
            }
        });

        numberOfPages = response.data.total_pages;
        return response.data.questions;
    } catch {
        return null;
    }
}

// Scroll to the saved scroll position
function scrollToSavedPosition() {
    document.documentElement.scrollTo({top: savedScrollPosition, behavior: 'instant'});
}

function renderQuestions(questions, questionCardsWrapper, questionLocation, divId, sort, loadQuestionId) {
    if (questions.length) {
        // Get if the questions are displayed directly or in a modal
        const directView = questionCardsWrapper.dataset.directView === 'true';

        // Moment.js is used to format the date
        moment.locale('fr-ch');

        // Sort the questions by date, likes (then date) or resolved (then date) (by default, sort by date)
        questions.sort(sortFunctions[sort]);

        // Clear the questions body (placeholder and questions)
        questionCardsWrapper.innerHTML = '';

        // Add the questions to the questions body
        questions.forEach((question) => {
            // Convert the date to a relative date
            question.relativeDate = moment(question.date).fromNow();

            if (questionLocation === QuestionLocation.COURSE || questionLocation === QuestionLocation.EXERCISE) {
                delete question.section_name;
            }

            // Create the question card
            const questionCard = createElementFromTemplate(questionCardTemplate(question));
            questionCardsWrapper.appendChild(questionCard);

            questionCard.addEventListener('click', (e) => {
                e.preventDefault();
                savedScrollPosition = document.documentElement.scrollTop;
                handleQuestionView(question.id, questionLocation, directView, divId);
                if (!directView) new bootstrap.Modal(document.querySelector('.question-modal')).show();
            });
        });

        // Add the pagination if needed
        if (questionLocation === QuestionLocation.ALL_QUESTIONS || questionLocation === QuestionLocation.MY_QUESTIONS) {
            const pagination = createElementFromTemplate(paginationTemplate(currentPage, numberOfPages));
            questionCardsWrapper.appendChild(pagination);

            // Add the event listeners to the previous and next buttons, and to the page buttons with event delegation
            pagination.addEventListener('click', (e) => {
                e.preventDefault();
                if (e.target.closest('.first-page-button') && currentPage > 1) {
                    currentPage = 1;
                    loadQuestionCards(`#${questionCardsWrapper.parentElement.id}`, questionLocation, divId, false)
                } else if (e.target.closest('.previous-button') && currentPage > 1) {
                    currentPage--;
                    loadQuestionCards(`#${questionCardsWrapper.parentElement.id}`, questionLocation, divId, false)
                } else if (e.target.closest('.next-button') && currentPage < numberOfPages) {
                    currentPage++;
                    loadQuestionCards(`#${questionCardsWrapper.parentElement.id}`, questionLocation, divId, false)
                } else if (e.target.closest('.page-button')) {
                    currentPage = parseInt(e.target.closest('.page-button').dataset.page);
                    loadQuestionCards(`#${questionCardsWrapper.parentElement.id}`, questionLocation, divId, false)
                } else if (e.target.closest('.last-page-button') && currentPage < numberOfPages) {
                    currentPage = numberOfPages;
                    loadQuestionCards(`#${questionCardsWrapper.parentElement.id}`, questionLocation, divId, false)
                }
            });
        }

        // Render LaTeX
        renderMathInElement(questionCardsWrapper);

    } else {
        // If there are no questions, take a message randomly from the list and
        // display it and the associated image.
        displayNoQuestionsMessage(questionCardsWrapper)
    }

    // If there is a question to load, load it
    if (loadQuestionId) {
        const questionCard = questionCardsWrapper.querySelector(`.question-card[data-question-id="${loadQuestionId}"]`);
        if (questionCard) {
            questionCard.click();
        }
    }
}

function displayNoQuestionsMessage(questionCardsWrapper) {
    if (!questionCardsWrapper.querySelector('.no-question')) {
        const noQuestionsMessage = createElementFromTemplate(noQuestionsMessageTemplate(baseUrl));
        questionCardsWrapper.innerHTML = '';
        questionCardsWrapper.appendChild(noQuestionsMessage);
    }
}

// Load the question cards to the modal and add them to the modal
async function loadQuestionCards(questionsBody, questionLocation, divId = '', createTopBar = true, loadQuestionId = null, loadQuestionsPage = currentPage) {
    // Get the questions body element
    const questionsBodyElement = document.querySelector(questionsBody);

    // Get the questions wrapper and add the placeholder
    const questionCardsWrapper = questionsBodyElement.querySelector('.question-cards-wrapper');
    questionCardsWrapper.innerHTML = '';
    const questionCardsPlaceholder = createElementFromTemplate(questionCardsPlaceholderTemplate());
    questionCardsWrapper.appendChild(questionCardsPlaceholder);

    // Check the feature flag and authentication for new questions
    let newQuestion = false;
    if (questionLocation !== QuestionLocation.ALL_QUESTIONS && questionLocation !== QuestionLocation.MY_QUESTIONS) {
        newQuestion = !!getAuthData() && await getFeatureFlag('newQuestion');
    }

    // Create the top bar with the sort dropdown and the new question button (if needed)
    if (createTopBar && !questionsBodyElement.querySelector('.tob-bar')) {

        // Add the top bar with the sort dropdown
        if (!questionsBodyElement.querySelector('.top-bar')) {
            const addBookmarksButton = questionLocation === QuestionLocation.MY_QUESTIONS;
            const topBar = createElementFromTemplate(questionCardsTopBarTemplate(Sort, addBookmarksButton));
            questionsBodyElement.prepend(topBar);

            // Add the popover to the website info button
            new bootstrap.Popover(topBar.querySelector('.website-info'), {
                container: 'body',
                html: true,
            });

            // Add the event listener to the sort dropdown and the dropdown items
            // (when click on the dropdown, the dropdown items are shown. When click on
            // a dropdown item, the dropdown items are hidden and the dropdown button
            // text is changed)
            const sortDropdown = topBar.querySelector('.sort-dropdown');
            const dropdownItems = topBar.querySelectorAll('.dropdown-item');
            sortDropdown.addEventListener('click', () => {
                dropdownItems.forEach((dropdownItem) => {
                    dropdownItem.addEventListener('click', (e) => {
                        e.preventDefault();
                        sortDropdown.textContent = dropdownItem.textContent;
                        currentSort = dropdownItem.dataset.sort;
                        //renderQuestions(currentQuestions, questionCardsWrapper, questionLocation, divId, currentSort);
                        loadQuestionCards(questionsBody, questionLocation, divId, false);
                    });
                });
            });

            // Add the event listener to the refresh button
            const refreshButton = topBar.querySelector('.refresh-button');
            refreshButton.addEventListener('click', (e) => {
                e.preventDefault();
                loadQuestionCards(questionsBody, questionLocation, divId, false);
            });

            // Add the event listener to the bookmarks button
            const bookmarksButton = topBar.querySelector('#bookmarksButton');
            if (bookmarksButton) {
                bookmarksButton.addEventListener('change', () => {
                    loadQuestionCards(questionsBody, questionLocation, divId, false);
                });
            }
        }

        // If the feature flag is enabled, the user is authenticated, and if there is not
        // already a new question button, add it to the top bar
        if (newQuestion && !questionsBodyElement.querySelector('.new-question-button')) {
            const newQuestionButton = createElementFromTemplate(newQuestionButtonTemplate());
            questionsBodyElement.querySelector('.top-bar .new-question').appendChild(newQuestionButton);

            // Add the event listener to the new question button
            newQuestionButton.addEventListener('click', () => {
                if (questionLocation === QuestionLocation.COURSE) {
                    handleNewQuestionView(divId, questionLocation);
                    new bootstrap.Modal(document.querySelector('.new-question-modal')).show();
                } else {
                    handleNewQuestionView(divId, questionLocation, true);
                }
            });
        }
    }

    const pageId = (questionLocation === QuestionLocation.COURSE || questionLocation === QuestionLocation.EXERCISE) ? getFileName() : '';

    let showBookmarks = false;
    if (questionLocation === QuestionLocation.MY_QUESTIONS) {
        const bookmarksButton = questionsBodyElement.querySelector('#bookmarksButton');
        if (bookmarksButton) {
            showBookmarks = bookmarksButton.checked;
        }
    }

    // Get the questions from the backend
    const questions = await fetchQuestions(questionLocation, pageId, divId, loadQuestionsPage, currentSort, showBookmarks);
    currentQuestions = questions || [];

    if (questions === null) {
        // Display an error message
        const errorElement = createElementFromTemplate(errorMessageTemplate(supportEmail));
        questionsBodyElement.innerHTML = '';
        questionsBodyElement.appendChild(errorElement);
        return;
    }

    // Render the questions
    renderQuestions(currentQuestions, questionCardsWrapper, questionLocation, divId, currentSort, loadQuestionId);
}

export {loadQuestionCards, renderQuestions, scrollToSavedPosition};
