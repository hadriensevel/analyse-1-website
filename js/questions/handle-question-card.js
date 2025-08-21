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
import {validateToken} from '../utils/auth';

import axios from 'axios';
import {baseUrl, supportEmail} from '../utils/config';
import moment from 'moment/src/moment';
import 'moment/src/locale/fr-ch';

// ----------------------------------
// STATE AND CONSTANTS
// ----------------------------------

let currentQuestions = [];
let currentSort = Sort.DATE;
let currentPage = 1;
let savedScrollPosition = 0;
let numberOfPages;

// Auto-refresh state
let currentQuestionsBody = null;
let currentQuestionLocation = null;
let currentDivId = null;

const PAGINATION_LOCATIONS = [
    QuestionLocation.ALL_QUESTIONS,
    QuestionLocation.MY_QUESTIONS
];

const AUTHENTICATED_LOCATIONS = [
    QuestionLocation.COURSE,
    QuestionLocation.EXERCISE
];

const DEFAULT_AXIOS_CONFIG = {
    headers: {
        Accept: 'application/json'
    }
};

// ----------------------------------
// UTILITY FUNCTIONS
// ----------------------------------

function isUserAuthenticated(authData) {
    return authData && authData !== 401 && authData !== 'session_expired';
}

function requiresPagination(questionLocation) {
    return PAGINATION_LOCATIONS.includes(questionLocation);
}

function updateUrlWithQuestion(questionId) {
    try {
        // Try to update parent window URL first (for iframe context)
        const targetWindow = window.parent !== window ? window.parent : window;
        const currentUrl = new URL(targetWindow.location.href);
        currentUrl.searchParams.set('question', questionId);
        targetWindow.history.pushState(null, '', currentUrl.toString());
    } catch (error) {
        // Fallback to current window if parent is not accessible
        try {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('question', questionId);
            window.history.pushState(null, '', currentUrl.toString());
        } catch (fallbackError) {
            console.warn('Could not update URL with question ID:', fallbackError);
        }
    }
}

function removeQuestionFromUrl() {
    try {
        // Try to update parent window URL first (for iframe context)
        const targetWindow = window.parent !== window ? window.parent : window;
        const currentUrl = new URL(targetWindow.location.href);
        if (currentUrl.searchParams.has('question')) {
            currentUrl.searchParams.delete('question');
            targetWindow.history.replaceState(null, '', currentUrl.toString());
        }
    } catch (error) {
        // Fallback to current window if parent is not accessible
        try {
            const currentUrl = new URL(window.location.href);
            if (currentUrl.searchParams.has('question')) {
                currentUrl.searchParams.delete('question');
                window.history.replaceState(null, '', currentUrl.toString());
            }
        } catch (fallbackError) {
            console.warn('Could not remove question from URL:', fallbackError);
        }
    }
}

function scrollToSavedPosition() {
    document.documentElement.scrollTo({top: savedScrollPosition, behavior: 'instant'});
}

function clearContainer(container) {
    container.innerHTML = '';
}

// ----------------------------------
// SORTING FUNCTIONS
// ----------------------------------

const sortFunctions = {
    [Sort.DATE]: (a, b) => new Date(b.date) - new Date(a.date),
    [Sort.LIKES]: (a, b) => b.likes - a.likes || new Date(b.date) - new Date(a.date),
    [Sort.RESOLVED]: (a, b) => b.resolved - a.resolved || new Date(b.date) - new Date(a.date),
    [Sort.NON_RESOLVED]: (a, b) => a.resolved - b.resolved || new Date(b.date) - new Date(a.date),
    [Sort.ANSWERS]: (a, b) => b.answers - a.answers || new Date(b.date) - new Date(a.date),
    [Sort.NO_ANSWER]: (a, b) => a.answers - b.answers || new Date(b.date) - new Date(a.date),
    [Sort.LAST_ACTIVITY]: (a, b) => new Date(b.last_activity) - new Date(a.last_activity) || new Date(b.date) - new Date(a.date),
};

// ----------------------------------
// API FUNCTIONS
// ----------------------------------

function buildQuestionsUrl(questionLocation, pageId, divId) {
    const baseRoutes = {
        [QuestionLocation.ALL_QUESTIONS]: `${baseUrl}/api/get-questions/all-questions`,
        [QuestionLocation.MY_QUESTIONS]: `${baseUrl}/api/get-questions/my-questions`
    };
    
    return baseRoutes[questionLocation] || `${baseUrl}/api/get-questions/${pageId}${divId ? `/${divId}` : ''}`;
}

function handleApiError(error) {
    console.error('API request failed:', error);
    return null;
}

function buildUrlParams(page, sort, showBookmarks) {
    const params = new URLSearchParams();
    
    if (page) params.set('page', page);
    if (sort) params.set('sort', sort);
    if (showBookmarks) params.set('bookmarked-questions', 'true');
    
    const paramString = params.toString();
    return paramString ? `?${paramString}` : '';
}

async function fetchQuestions(questionLocation, pageId, divId, page, sort, showBookmarks) {
    const baseUrl = buildQuestionsUrl(questionLocation, pageId, divId);
    const params = buildUrlParams(page, sort, showBookmarks);
    const url = `${baseUrl}${params}`;

    try {
        const response = await axios.get(url, DEFAULT_AXIOS_CONFIG);
        numberOfPages = response.data.total_pages;
        return response.data.questions;
    } catch (error) {
        return handleApiError(error);
    }
}

// ----------------------------------
// QUESTION RENDERING
// ----------------------------------

function formatQuestionData(question, questionLocation) {
    moment.locale('fr-ch');
    question.relativeDate = moment(question.date).fromNow();
    
    if (AUTHENTICATED_LOCATIONS.includes(questionLocation)) {
        delete question.section_name;
    }
    
    return question;
}

function createQuestionCard(question, questionLocation, directView, divId) {
    const formattedQuestion = formatQuestionData(question, questionLocation);
    const questionCard = createElementFromTemplate(questionCardTemplate(formattedQuestion));
    
    questionCard.addEventListener('click', (e) => {
        e.preventDefault();
        savedScrollPosition = document.documentElement.scrollTop;
        
        // Update URL with question ID for easy sharing (only for all questions page)
        if (questionLocation === QuestionLocation.ALL_QUESTIONS) {
            updateUrlWithQuestion(question.id);
        }
        
        handleQuestionView(question.id, questionLocation, directView, divId);
        if (!directView) {
            new bootstrap.Modal(document.querySelector('.question-modal')).show();
        }
    });
    
    return questionCard;
}

function renderQuestionCards(questions, questionCardsWrapper, questionLocation, divId) {
    const directView = questionCardsWrapper.dataset.directView === 'true';
    clearContainer(questionCardsWrapper);
    
    questions.forEach((question) => {
        const questionCard = createQuestionCard(question, questionLocation, directView, divId);
        questionCardsWrapper.appendChild(questionCard);
    });
}

function renderQuestions(questions, questionCardsWrapper, questionLocation, divId, sort, loadQuestionId) {
    if (questions.length === 0) {
        displayNoQuestionsMessage(questionCardsWrapper);
        return;
    }
    
    questions.sort(sortFunctions[sort]);
    renderQuestionCards(questions, questionCardsWrapper, questionLocation, divId);
    
    if (requiresPagination(questionLocation)) {
        addPagination(questionCardsWrapper, questionLocation, divId);
    }
    
    renderMathInElement(questionCardsWrapper);
    
    if (loadQuestionId) {
        loadSpecificQuestion(questionCardsWrapper, loadQuestionId);
    }
}

function displayNoQuestionsMessage(questionCardsWrapper) {
    if (!questionCardsWrapper.querySelector('.no-question')) {
        const noQuestionsMessage = createElementFromTemplate(noQuestionsMessageTemplate());
        clearContainer(questionCardsWrapper);
        questionCardsWrapper.appendChild(noQuestionsMessage);
    }
}

function loadSpecificQuestion(questionCardsWrapper, loadQuestionId) {
    // Use a more robust approach with retries and better error handling
    const attemptLoadQuestion = (retries = 3) => {
        const questionCard = questionCardsWrapper.querySelector(`.question-card[data-question-id="${loadQuestionId}"]`);
        if (questionCard) {
            // Use a more reliable way to trigger the click event
            setTimeout(() => {
                questionCard.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
            }, 100);
            return true;
        } else if (retries > 0) {
            // Retry after a short delay in case the DOM isn't ready yet
            setTimeout(() => attemptLoadQuestion(retries - 1), 200);
            return false;
        } else {
            console.warn(`Question with ID ${loadQuestionId} not found in current page`);
            return false;
        }
    };
    
    // Start the attempt with a small initial delay to ensure DOM is ready
    setTimeout(() => attemptLoadQuestion(), 50);
}

// ----------------------------------
// PAGINATION HANDLING
// ----------------------------------

function handlePaginationClick(target, questionCardsWrapper, questionLocation, divId) {
    const questionsBodyId = `#${questionCardsWrapper.parentElement.id}`;
    
    if (target.closest('.first-page-button') && currentPage > 1) {
        currentPage = 1;
        loadQuestionCards(questionsBodyId, questionLocation, divId, false);
    } else if (target.closest('.previous-button') && currentPage > 1) {
        currentPage--;
        loadQuestionCards(questionsBodyId, questionLocation, divId, false);
    } else if (target.closest('.next-button') && currentPage < numberOfPages) {
        currentPage++;
        loadQuestionCards(questionsBodyId, questionLocation, divId, false);
    } else if (target.closest('.page-button')) {
        currentPage = parseInt(target.closest('.page-button').dataset.page);
        loadQuestionCards(questionsBodyId, questionLocation, divId, false);
    } else if (target.closest('.last-page-button') && currentPage < numberOfPages) {
        currentPage = numberOfPages;
        loadQuestionCards(questionsBodyId, questionLocation, divId, false);
    }
}

function addPagination(questionCardsWrapper, questionLocation, divId) {
    const pagination = createElementFromTemplate(paginationTemplate(currentPage, numberOfPages));
    questionCardsWrapper.appendChild(pagination);
    
    pagination.addEventListener('click', (e) => {
        e.preventDefault();
        handlePaginationClick(e.target, questionCardsWrapper, questionLocation, divId);
    });
}

// ----------------------------------
// MAIN LOADING FUNCTION
// ----------------------------------

// ----------------------------------
// TOP BAR SETUP
// ----------------------------------

function setupSortDropdown(topBar, questionsBody, questionLocation, divId) {
    const sortDropdown = topBar.querySelector('.sort-dropdown');
    const dropdownItems = topBar.querySelectorAll('.dropdown-item');
    
    sortDropdown.addEventListener('click', () => {
        dropdownItems.forEach((dropdownItem) => {
            dropdownItem.addEventListener('click', (e) => {
                e.preventDefault();
                sortDropdown.textContent = dropdownItem.textContent;
                currentSort = dropdownItem.dataset.sort;
                loadQuestionCards(questionsBody, questionLocation, divId, false);
            });
        });
    });
}


function setupBookmarksButton(topBar, questionsBody, questionLocation, divId) {
    const bookmarksButton = topBar.querySelector('#bookmarksButton');
    if (bookmarksButton) {
        bookmarksButton.addEventListener('change', () => {
            loadQuestionCards(questionsBody, questionLocation, divId, false);
        });
    }
}

function createTopBar(questionsBodyElement, questionLocation) {
    const addBookmarksButton = questionLocation === QuestionLocation.MY_QUESTIONS;
    const topBar = createElementFromTemplate(questionCardsTopBarTemplate(Sort, addBookmarksButton));
    questionsBodyElement.prepend(topBar);
    
    new bootstrap.Popover(topBar.querySelector('.website-info'), {
        container: 'body',
        html: true,
    });
    
    return topBar;
}

function setupNewQuestionButton(questionsBodyElement, divId, questionLocation) {
    const newQuestionButton = createElementFromTemplate(newQuestionButtonTemplate());
    questionsBodyElement.querySelector('.top-bar .new-question').appendChild(newQuestionButton);
    
    newQuestionButton.addEventListener('click', () => {
        if (questionLocation === QuestionLocation.COURSE) {
            handleNewQuestionView(divId, questionLocation);
            new bootstrap.Modal(document.querySelector('.new-question-modal')).show();
        } else {
            handleNewQuestionView(divId, questionLocation, true);
        }
    });
}

async function checkNewQuestionEligibility(questionLocation) {
    if (PAGINATION_LOCATIONS.includes(questionLocation)) {
        return false;
    }
    
    const authData = await validateToken();
    return isUserAuthenticated(authData) && await getFeatureFlag('newQuestion');
}

async function setupTopBar(questionsBodyElement, questionsBody, questionLocation, divId) {
    if (questionsBodyElement.querySelector('.top-bar')) {
        return;
    }
    
    const topBar = createTopBar(questionsBodyElement, questionLocation);
    setupSortDropdown(topBar, questionsBody, questionLocation, divId);
    setupBookmarksButton(topBar, questionsBody, questionLocation, divId);
    
    const canAddNewQuestion = await checkNewQuestionEligibility(questionLocation);
    if (canAddNewQuestion && !questionsBodyElement.querySelector('.new-question-button')) {
        setupNewQuestionButton(questionsBodyElement, divId, questionLocation);
    }
}

function initializePlaceholder(questionCardsWrapper) {
    clearContainer(questionCardsWrapper);
    const placeholder = createElementFromTemplate(questionCardsPlaceholderTemplate());
    questionCardsWrapper.appendChild(placeholder);
}

function getPageId(questionLocation) {
    return AUTHENTICATED_LOCATIONS.includes(questionLocation) ? getFileName() : '';
}

function shouldShowBookmarks(questionsBodyElement, questionLocation) {
    if (questionLocation !== QuestionLocation.MY_QUESTIONS) {
        return false;
    }
    
    const bookmarksButton = questionsBodyElement.querySelector('#bookmarksButton');
    return bookmarksButton?.checked || false;
}

function handleLoadError(questionsBodyElement) {
    const errorElement = createElementFromTemplate(errorMessageTemplate(supportEmail));
    clearContainer(questionsBodyElement);
    questionsBodyElement.appendChild(errorElement);
}

async function loadQuestionCards(questionsBody, questionLocation, divId = '', createTopBar = true, loadQuestionId = null) {
    const questionsBodyElement = document.querySelector(questionsBody);
    const questionCardsWrapper = questionsBodyElement.querySelector('.question-cards-wrapper');
    
    initializePlaceholder(questionCardsWrapper);
    
    if (createTopBar && !questionsBodyElement.querySelector('.tob-bar')) {
        await setupTopBar(questionsBodyElement, questionsBody, questionLocation, divId);
        // Enable auto-refresh when setting up the top bar
        enableAutoRefresh(questionsBody, questionLocation, divId);
    }
    
    const pageId = getPageId(questionLocation);
    const showBookmarks = shouldShowBookmarks(questionsBodyElement, questionLocation);
    
    const questions = await fetchQuestions(questionLocation, pageId, divId, currentPage, currentSort, showBookmarks);
    currentQuestions = questions || [];
    
    if (questions === null) {
        handleLoadError(questionsBodyElement);
        return;
    }
    
    renderQuestions(currentQuestions, questionCardsWrapper, questionLocation, divId, currentSort, loadQuestionId);
}

// ----------------------------------
// AUTO-REFRESH FUNCTIONALITY
// ----------------------------------

function triggerAutoRefresh() {
    if (currentQuestionsBody && currentQuestionLocation !== null) {
        // Use saved scroll position instead of current position when auto-refreshing
        const scrollPosition = savedScrollPosition || document.documentElement.scrollTop;
        loadQuestionCards(currentQuestionsBody, currentQuestionLocation, currentDivId, false);
        // Restore scroll position after refresh with a longer delay to ensure content is rendered
        setTimeout(() => {
            document.documentElement.scrollTo({top: scrollPosition, behavior: 'instant'});
        }, 150);
    }
}

function enableAutoRefresh(questionsBody, questionLocation, divId) {
    currentQuestionsBody = questionsBody;
    currentQuestionLocation = questionLocation;
    currentDivId = divId;
    
    // Listen for question view returns and updates
    window.addEventListener('question-view-closed', triggerAutoRefresh);
    window.addEventListener('new-question-submitted', triggerAutoRefresh);
    window.addEventListener('question-updated', triggerAutoRefresh);
}

function disableAutoRefresh() {
    window.removeEventListener('question-view-closed', triggerAutoRefresh);
    window.removeEventListener('new-question-submitted', triggerAutoRefresh);
    window.removeEventListener('question-updated', triggerAutoRefresh);
    
    currentQuestionsBody = null;
    currentQuestionLocation = null;
    currentDivId = null;
}

export {loadQuestionCards, renderQuestions, scrollToSavedPosition, enableAutoRefresh, disableAutoRefresh, triggerAutoRefresh, removeQuestionFromUrl};
