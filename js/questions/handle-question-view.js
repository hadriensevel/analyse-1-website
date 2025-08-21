// ----------------------------------
// HANDLE THE VIEW FOR A QUESTION
// ----------------------------------

import {createElementFromTemplate, closeModal} from './templates/utils.js';
import {
    polycopDivViewTemplate,
    questionViewTemplate,
    questionModalTemplate,
    questionAnswersTemplate,
    questionEditFormTemplate,
    answerEditFormTemplate,
} from './templates/question-view.js';
import {QuestionLocation, updatePreview, UserRole} from './utils';
import {processLineBreaks} from './utils';

import moment from 'moment/src/moment';
import 'moment/src/locale/fr-ch';
import {baseUrl, supportEmail} from '../utils/config';
import {validateToken} from '../utils/auth';
import axios from 'axios';
import {UserPermissions} from './user-permissions';
import {rightIframeLink} from '../utils/right-iframe-link';
import {scrollToSavedPosition} from './handle-question-card';
import {removeQuestionFromUrl} from './handle-question-card';

// ----------------------------------
// STATE AND CONSTANTS
// ----------------------------------

let question = null;

const FORM_STATES = {
    SENDING: 'sending',
    VALIDATED: 'was-validated'
};

const SPINNER_HTML = `
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    <span role="status">Envoi...</span>
`;

const TOAST_DEFAULTS = { delay: 5000 };

// ----------------------------------
// API UTILITIES
// ----------------------------------

async function sendLike(questionId, like, answer = false) {
    const endpoint = like ? 'add' : 'remove';
    const method = like ? 'post' : 'delete';
    return axios[method](`${baseUrl}/api/like/${endpoint}${answer ? '-answer' : ''}/${questionId}`);
}

async function sendBookmark(questionId, bookmark) {
    const endpoint = bookmark ? 'add' : 'remove';
    const method = bookmark ? 'post' : 'delete';
    return axios[method](`${baseUrl}/api/bookmark/${endpoint}/${questionId}`);
}

async function fetchQuestion(questionId) {
    try {
        const response = await axios.get(`${baseUrl}/api/question/get/${questionId}`, {
            headers: {
                Accept: 'application/json',
            }
        });
        return response.data.question;
    } catch {
        return null;
    }
}

// ----------------------------------
// FORM UTILITIES
// ----------------------------------

function setupLoadingButton(button) {
    button.setAttribute('disabled', '');
    button.classList.add(FORM_STATES.SENDING);
    const originalContent = button.innerHTML;
    button.innerHTML = SPINNER_HTML;
    
    return () => {
        button.removeAttribute('disabled');
        button.classList.remove(FORM_STATES.SENDING);
        button.innerHTML = originalContent;
    };
}

function setupFormValidation(form, onValid) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add(FORM_STATES.VALIDATED);
        } else {
            await onValid(new FormData(form));
        }
    });
}

function setupFormCancel(form, onCancel) {
    const cancelButton = form.querySelector('.cancel-button');
    if (cancelButton) {
        cancelButton.addEventListener('click', (e) => {
            e.preventDefault();
            onCancel();
        });
    }
}

function setupPreviewUpdate(form) {
    const textarea = form.querySelector('textarea');
    if (textarea) {
        textarea.addEventListener('input', () => {
            updatePreview(
                textarea,
                form.querySelector('.preview'),
                form.querySelector('.preview-body'),
                form.querySelector('.preview-text')
            );
        });
    }
}

function showErrorAlert(message) {
    alert(message);
}

function showSuccessAlert(message) {
    alert(message);
}

function showToast(toastElement, options = TOAST_DEFAULTS) {
    const toast = new bootstrap.Toast(toastElement, options);
    toast.show();
}

// ----------------------------------
// QUESTION EDITING
// ----------------------------------

async function editQuestion(questionViewElement, questionId) {
    const questionBody = questionViewElement.querySelector('.question-body');
    const questionHeader = questionViewElement.querySelector('.question-header');
    const form = createElementFromTemplate(questionEditFormTemplate(question.body));
    
    const showElements = () => {
        questionBody.classList.remove('d-none');
        questionHeader.classList.remove('d-none');
    };
    
    const hideElements = () => {
        questionHeader.classList.add('d-none');
        questionBody.classList.add('d-none');
    };
    
    const cleanup = () => {
        form.remove();
        showElements();
    };
    
    setupFormValidation(form, async (formData) => {
        const resetButton = setupLoadingButton(form.querySelector('button[type="submit"]'));
        
        try {
            await axios.post(`${baseUrl}/api/question/edit/${questionId}`, formData);
            
            questionBody.innerHTML = processLineBreaks(formData.get('question-body'));
            question.body = formData.get('question-body');
            
            cleanup();
            renderMathInElement(questionBody);
            
            // Trigger auto-refresh of question cards
            window.dispatchEvent(new CustomEvent('question-updated'));
        } catch (error) {
            showErrorAlert('Erreur lors de l\'enregistrement de la question.');
            resetButton();
        }
    });
    
    setupFormCancel(form, cleanup);
    setupPreviewUpdate(form);
    
    hideElements();
    questionBody.after(form);
}

async function deleteQuestion(questionId, directView, questionView) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette question?')) {
        try {
            await axios.delete(`${baseUrl}/api/question/delete/${questionId}`);
            
            // Remove question ID from URL when question is deleted (only for all questions page)
            const questionsBody = document.querySelector('#all-questions');
            if (questionsBody) {
                removeQuestionFromUrl();
            }
            
            if (directView) {
                questionView.remove();
                document.querySelector('.top-bar').classList.remove('d-none');
                document.querySelector('.question-cards-wrapper').classList.remove('d-none');
            } else {
                closeModal(questionView.closest('.question-modal'));
            }
            
            // Trigger auto-refresh of question cards
            window.dispatchEvent(new CustomEvent('question-updated'));
        } catch {
            showErrorAlert('Erreur lors de la suppression de la question.');
        }
    }
}

async function markQuestionForLLMTraining(questionView, questionId) {
    try {
        // Get current state from the button text to determine action
        const dropdownMenu = questionView.querySelector('.dropdown-menu');
        const markButton = dropdownMenu.querySelector('.dropdown-item[data-action="mark-llm-training"]');
        const isCurrentlyMarked = markButton.textContent.includes('Retirer');
        
        const endpoint = isCurrentlyMarked ? 'unmark-llm-training' : 'mark-llm-training';
        await axios.post(`${baseUrl}/api/question/${endpoint}/${questionId}`);
        
        // Update the button text
        markButton.textContent = isCurrentlyMarked ? 'Marquer pour l\'entrainement IA' : 'Retirer de l\'entrainement IA';
        
        // Show success message
        const action = isCurrentlyMarked ? 'retirée de' : 'marquée pour';
        showSuccessAlert(`Question ${action} l'entrainement IA.`);
        
        // Trigger auto-refresh of question cards
        window.dispatchEvent(new CustomEvent('question-updated'));
    } catch {
        showErrorAlert('Erreur lors de la mise à jour du marquage pour l\'entrainement IA.');
    }
}

// ----------------------------------
// ANSWER EDITING
// ----------------------------------

async function editAnswer(answerElement, questionId, answerId) {
    const answerBody = answerElement.querySelector('.answer-body');
    const answerFooter = answerElement.querySelector('.answer-footer');
    const answer = question['answers'].find(answer => answer.id === parseInt(answerId));
    const form = createElementFromTemplate(answerEditFormTemplate(answer.body));
    
    const showElements = () => {
        answerBody.classList.remove('d-none');
        answerFooter.classList.remove('d-none');
    };
    
    const hideElements = () => {
        answerBody.classList.add('d-none');
        answerFooter.classList.add('d-none');
    };
    
    const cleanup = () => {
        form.remove();
        showElements();
    };
    
    setupFormValidation(form, async (formData) => {
        const resetButton = setupLoadingButton(form.querySelector('button[type="submit"]'));
        
        try {
            await axios.post(`${baseUrl}/api/answer/edit/${answerId}`, formData);
            
            answerBody.innerHTML = processLineBreaks(formData.get('answer-body'));
            answer.body = formData.get('answer-body');
            
            cleanup();
            renderMathInElement(answerBody);
            
            // Trigger auto-refresh of question cards
            window.dispatchEvent(new CustomEvent('question-updated'));
        } catch {
            showErrorAlert('Erreur lors de l\'enregistrement de la réponse.');
            resetButton();
        }
    });
    
    setupFormCancel(form, cleanup);
    setupPreviewUpdate(form);
    
    hideElements();
    answerBody.before(form);
}

async function deleteAnswer(answerElement, answerId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réponse?')) {
        try {
            await axios.delete(`${baseUrl}/api/answer/delete/${answerId}`);
            answerElement.remove();

            const answerCountElement = document.querySelector('.count-answers');
            const answerCount = parseInt(answerCountElement.textContent);
            answerCountElement.textContent = answerCount - 1;
            
            // Trigger auto-refresh of question cards
            window.dispatchEvent(new CustomEvent('question-updated'));
        } catch {
            showErrorAlert('Erreur lors de la suppression de la réponse.');
        }
    }
}

async function acceptAnswer(answerElement, answerId) {
    const answerAcceptedElement = answerElement.querySelector('.answer-accepted');
    const accepted = answerAcceptedElement.dataset.accepted === 'true';

    try {
        await axios.post(`${baseUrl}/api/answer/${accepted ? 'unaccept' : 'accept'}/${answerId}`);

        answerAcceptedElement.dataset.accepted = accepted ? 'false' : 'true';

        const dropdownMenu = answerElement.querySelector('.dropdown-menu');
        const acceptButton = dropdownMenu.querySelector('.dropdown-item[data-action="accept"]');
        acceptButton.textContent = accepted ? 'Valider la réponse' : 'Invalider la réponse';
        
        // Trigger auto-refresh of question cards
        window.dispatchEvent(new CustomEvent('question-updated'));
    } catch {
        showErrorAlert('Erreur lors de la mise à jour de la réponse.');
    }
}


// ----------------------------------
// ANSWER FORM HANDLING
// ----------------------------------

async function handleAnswerFormSubmission(elements) {
    const { form, questionId, previewBodyText, preview, questionView } = elements;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const resetButton = setupLoadingButton(submitButton);
    
    formData.append('question-id', questionId);

    try {
        await axios.post(`${baseUrl}/api/answer/new`, formData);

        form.reset();
        previewBodyText.textContent = '';
        preview.classList.add('d-none');
        form.classList.remove(FORM_STATES.VALIDATED);

        await populateAnswers(questionView, questionId);

        const answerCountElement = questionView.querySelector('.count-answers');
        const answerCount = parseInt(answerCountElement.textContent);
        answerCountElement.textContent = answerCount + 1;
        
        // Trigger auto-refresh of question cards
        window.dispatchEvent(new CustomEvent('question-updated'));
    } catch {
        showErrorAlert('Erreur lors de l\'envoi de la réponse.');
    } finally {
        resetButton();
    }
}

// ----------------------------------
// EVENT LISTENER SETUP
// ----------------------------------

function isUserAuthenticated(authData) {
    return authData && authData !== 401 && authData !== 'session_expired';
}

function toggleLikeButton(button, isLiked) {
    const count = parseInt(button.textContent);
    if (isLiked) {
        button.textContent = count - 1;
        button.classList.remove('liked');
    } else {
        button.textContent = count + 1;
        button.classList.add('liked');
    }
}

async function setupEventListeners(elements) {
    const { form, textarea, preview, previewBody, previewBodyText, questionView, questionId, directView } = elements;

    setupAnswerForm({ form, questionId, previewBodyText, preview, questionView });
    setupTextareaPreview(textarea, preview, previewBody, previewBodyText);
    await setupLikeButton(questionView, questionId);
    await setupBookmarkButton(questionView, questionId);

    if (directView) {
        setupDirectViewNavigation(questionView, questionId);
    } else {
        setupModalNavigation(questionView.closest('.question-modal'));
    }
}

function setupAnswerForm(elements) {
    const { form } = elements;
    if (!form) return;

    setupFormValidation(form, () => handleAnswerFormSubmission(elements));
}

function setupTextareaPreview(textarea, preview, previewBody, previewBodyText) {
    if (textarea) {
        textarea.addEventListener('input', () => {
            updatePreview(textarea, preview, previewBody, previewBodyText);
        });
    }
}

async function setupLikeButton(questionView, questionId) {
    const authData = await validateToken();
    if (!isUserAuthenticated(authData)) return;
    
    const likeButton = questionView.querySelector('.question-likes');
    if (!likeButton) return;
    
    likeButton.classList.add('clickable');
    likeButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const isLiked = likeButton.classList.contains('liked');
        toggleLikeButton(likeButton, isLiked);
        sendLike(questionId, !isLiked);
    });
}

async function setupBookmarkButton(questionView, questionId) {
    const authData = await validateToken();
    if (!isUserAuthenticated(authData)) return;
    
    const bookmarkButton = questionView.querySelector('.question-bookmarked');
    if (!bookmarkButton) return;
    
    bookmarkButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const bookmarked = bookmarkButton.dataset.bookmarked === 'true';
        bookmarkButton.dataset.bookmarked = bookmarked ? 'false' : 'true';
        sendBookmark(questionId, !bookmarked);
    });
}

async function setupAnswerLikes(answerContainer) {
    const authData = await validateToken();
    if (!isUserAuthenticated(authData)) return;

    const likeButtons = answerContainer.querySelectorAll('.answer-likes');
    likeButtons.forEach(button => button.classList.add('clickable'));

    answerContainer.addEventListener('click', (e) => {
        const target = e.target;
        if (!target.matches('.answer-likes')) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const answerId = target.closest('.answer').dataset.answerId;
        const isLiked = target.classList.contains('liked');
        
        toggleLikeButton(target, isLiked);
        sendLike(answerId, !isLiked, true);
    });
}

function setupModalNavigation(questionModal) {
    questionModal.addEventListener('click', (e) => {
        const isBackButton = e.target.classList.contains('back-button');
        const isCloseButton = e.target.classList.contains('btn-close');
        
        if (isBackButton || isCloseButton) {
            // Remove question ID from URL when modal is closed (only for all questions page)
            const questionsBody = document.querySelector('#all-questions');
            if (questionsBody) {
                removeQuestionFromUrl();
            }
            
            closeModal(questionModal);
            if (isCloseButton) {
                closeModal(document.querySelector('.question-list-modal'), true);
            }
            // Trigger auto-refresh of question cards when modal is closed
            window.dispatchEvent(new CustomEvent('question-view-closed'));
        }
    });
}

function setupDirectViewNavigation(questionView, questionId) {
    const topBar = createTopBar(questionId);
    questionView.prepend(topBar);
    
    topBar.addEventListener('click', (e) => {
        if (e.target.classList.contains('back-button')) {
            e.preventDefault();
            returnToQuestionList(questionView);
        }
    });
}

function createTopBar(questionId) {
    const topBar = document.createElement('div');
    topBar.classList.add('top-bar');
    topBar.innerHTML = `
        <a class="back-button" href="#" aria-label="Retour" title="Retour"></a>
        <h1 class="question-view-title">Question #${questionId}</h1>
        <div class="question-link"></div>
    `;
    return topBar;
}

function returnToQuestionList(questionView) {
    questionView.remove();
    document.querySelector('.top-bar').classList.remove('d-none');
    document.querySelector('.question-cards-wrapper').classList.remove('d-none');
    scrollToSavedPosition();
    
    // Remove question ID from URL when returning to question list (only for all questions page)
    const questionsBody = document.querySelector('#all-questions');
    if (questionsBody) {
        removeQuestionFromUrl();
    }
    
    // Trigger auto-refresh of question cards with a slight delay to ensure scroll is applied first
    setTimeout(() => {
        window.dispatchEvent(new CustomEvent('question-view-closed'));
    }, 100);
}

function initializeDivPolycopView(questionView, divId) {
    if (!divId) return;

    // If divId starts with a number, escape it
    const divIdStartsWithNumber = /^\d/.test(divId);
    if (divIdStartsWithNumber) divId = `\\3${divId}`;

    const divViewPolycop = createElementFromTemplate(polycopDivViewTemplate())
    const divView = divViewPolycop.querySelector('#div-view');
    const questionDiv = document.querySelector(`#${divId} .div-container`);
    if (questionDiv) divView.appendChild(questionDiv.cloneNode(true));
    questionView.prepend(divViewPolycop);
}

function initializeQuestionOptions(questionView, userIsAuthor, questionLocked, questionId, directView) {
    const dropdownMenu = questionView.querySelector('.dropdown-menu');

    if (!dropdownMenu) return;
    dropdownMenu.addEventListener('click', (e) => {
        const target = e.target;

        if (target.matches('.dropdown-item[data-action="edit"]')) {
            e.preventDefault();
            editQuestion(questionView, questionId);
        } else if (target.matches('.dropdown-item[data-action="lock"]')) {
            e.preventDefault();
            //lockQuestion(questionView, questionId);
        } else if (target.matches('.dropdown-item[data-action="mark-llm-training"]')) {
            e.preventDefault();
            markQuestionForLLMTraining(questionView, questionId);
        } else if (target.matches('.dropdown-item[data-action="delete"]')) {
            e.preventDefault();
            deleteQuestion(questionId, directView, questionView);
        }
    });
}

function initializeQuestionLink(questionView, page, divId, location, sectionName) {
    const link = location === 'course' ? `../../analyse-1/resources/sections/${page}.html?div=${divId}` : `${window.parent.location.pathname}?page=${page}`;

    // Add the name of the section to the top bar
    const topBarLink = questionView.querySelector('.top-bar > .question-link');
    const sectionTitleElement = document.createElement('span');
    sectionTitleElement.textContent = sectionName ? ` - ${sectionName}` : '';

    // Add the link to the top bar
    const linkElement = document.createElement('a');
    if (location === 'course') linkElement.classList.add('right-iframe-link');
    else linkElement.target = '_blank';
    linkElement.href = link;

    topBarLink.appendChild(sectionTitleElement);
    topBarLink.appendChild(linkElement);

    renderMathInElement(topBarLink);

    rightIframeLink();
}

async function initializeQuestionView(questionContainer, questionId, questionLocation, divId, directView = false) {
    question = await fetchQuestion(questionId);

    if (question === null) {
        renderQuestionError(questionContainer, questionId, directView);
        return;
    }

    await setupQuestionPermissions();

    formatQuestionData();

    const questionView = createElementFromTemplate(
        questionViewTemplate(question, question.user_authenticated && !question.locked)
    );
    questionContainer.appendChild(questionView);

    await populateAnswers(questionView, questionId);
    
    initializeQuestionOptions(questionView, question.user_is_author, question.locked, questionId, directView);
    initializeDivPolycopView(questionView, divId);
    
    renderMathInElement(questionView);

    const elements = {
        textarea: questionView.querySelector('textarea'),
        form: questionView.querySelector('form'),
        preview: questionView.querySelector('.preview'),
        previewBody: questionView.querySelector('.preview-body'),
        previewBodyText: questionView.querySelector('.preview-text'),
        questionView,
        questionId,
        directView,
        questionContainer
    };

    await setupEventListeners(elements);

    if (shouldShowQuestionLink(questionLocation)) {
        initializeQuestionLink(questionView, question.page_id, question.div_id, question.location, question.section_name);
    }
}

function shouldShowQuestionLink(questionLocation) {
    return questionLocation !== QuestionLocation.COURSE && questionLocation !== QuestionLocation.EXERCISE;
}

function renderQuestionError(questionContainer, questionId, directView) {
    const errorElement = createElementFromTemplate(`
        <div class="question-view">
            <h6>Oups...</h6>
            <p>Nous n'avons pas réussi à récupérer la question, peut-être qu'elle n'existe plus :(</p>
            <p>Si le problème persiste, n'hésitez pas à nous contacter ici: 
                <a href="mailto:${supportEmail}?subject=Erreur lors du chargement de la question #${questionId}">
                    ${supportEmail}
                </a>.
            </p>
        </div>
    `);
    
    questionContainer.appendChild(errorElement);

    if (directView) {
        setupDirectViewNavigation(errorElement, questionId);
    } else {
        setupModalNavigation(errorElement.closest('.question-modal'));
    }
}

async function setupQuestionPermissions() {
    const authData = await validateToken();
    const userRole = authData?.role;
    const userIsAdmin = authData?.is_admin;
    const userPermissions = new UserPermissions({
        userRole, 
        isAdmin: userIsAdmin, 
        isAuthor: question.user_is_author
    });
    
    question.user_authenticated = isUserAuthenticated(authData);
    question.can_edit = userPermissions.canEditQuestion();
    question.can_delete = userPermissions.canDeleteQuestion();
    question.can_lock = userPermissions.canLockQuestion();
    question.can_mark_for_llm_training = userPermissions.canMarkForLLMTraining();
}

async function populateAnswers(questionView, questionId) {
    const answersContainer = questionView.querySelector('.answers');
    clearContainer(answersContainer);

    const questionData = await fetchQuestion(questionId);
    question.answers = questionData.answers;

    const authData = await validateToken();
    const userRole = authData?.role;
    const userIsAdmin = authData?.is_admin;

    question.answers.forEach(answer => {
        setupAnswerPermissions(answer, userRole, userIsAdmin);
        formatAnswerData(answer);
        
        const answerElement = createElementFromTemplate(questionAnswersTemplate(answer, question.locked));
        answersContainer.appendChild(answerElement);
        
        initializeAnswerOptions(answerElement, questionId);
    });

    await setupAnswerLikes(answersContainer);
    rightIframeLink();
    renderMathInElement(answersContainer);
}

function clearContainer(container) {
    while (container.firstChild) {
        container.firstChild.remove();
    }
}

function setupAnswerPermissions(answer, userRole, userIsAdmin) {
    const userPermissions = new UserPermissions({
        userRole, 
        isAdmin: userIsAdmin, 
        isAuthor: answer.user_is_author
    });
    
    answer.can_edit = userPermissions.canEditAnswer();
    answer.can_delete = userPermissions.canDeleteAnswer();
    answer.can_accept = userPermissions.canAcceptAnswer();
}

function formatAnswerData(answer) {
    answer.date = moment(answer.date).fromNow();
    answer.user_badge = getUserBadge(answer.user_role, answer.is_op, answer.endorsed_assistant);
    answer.formatted_body = processLineBreaks(answer.body);
}

function initializeAnswerOptions(answerElement, questionId) {
    const dropdownMenu = answerElement.querySelector('.dropdown-menu');
    if (!dropdownMenu) return;
    
    dropdownMenu.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        if (!action) return;
        
        e.preventDefault();
        
        const answerId = answerElement.dataset.answerId;
        
        switch (action) {
            case 'edit':
                editAnswer(answerElement, questionId, answerId);
                break;
            case 'accept':
                acceptAnswer(answerElement, answerId);
                break;
            case 'delete':
                deleteAnswer(answerElement, answerId);
                break;
        }
    });
}

// ----------------------------------
// DATA FORMATTING
// ----------------------------------

function formatQuestionData() {
    moment.locale('fr-ch');
    question.formatted_body = processLineBreaks(question.body);
    question.date = moment(question.date).fromNow();
    question.image_tag = question.image
        ? `<img class="question-image" src="${baseUrl}/api/image/${question.image}" alt="Image de la question">`
        : '';
}

function getUserBadge(role, isOp, isEndorsedAssistant) {
    const badgeMap = {
        [UserRole.TEACHER]: '<span class="badge text-bg-warning">Enseignant</span>',
        [UserRole.ASSISTANT]: isEndorsedAssistant 
            ? '<span class="badge text-bg-success">Assistant·e</span>' 
            : '<span class="badge text-bg-secondary">Assistant·e</span>',
        [UserRole.STUDENT]: isOp ? '<span class="badge text-bg-light">Auteur original</span>' : '',
        [UserRole.LLM]: '<span class="badge text-bg-info">Modèle de langage (beta)</span>',
    };
    return badgeMap[role] || '';
}

// ----------------------------------
// BOOTSTRAP MODAL EVENT HANDLING
// ----------------------------------

// Global event listener for Bootstrap modal hide events (ESC, outside click, etc.)
document.addEventListener('hide.bs.modal', (e) => {
    // Check if this is a question modal being closed (only for all questions page)
    if (e.target.classList.contains('question-modal')) {
        const questionsBody = document.querySelector('#all-questions');
        if (questionsBody) {
            removeQuestionFromUrl();
        }
    }
});

// Handle browser back button when viewing a question
const handlePopState = (e) => {
    try {
        // Only handle popstate for all questions page
        const questionsBody = document.querySelector('#all-questions');
        if (!questionsBody) return;
        
        // Try to get URL from parent window first (for iframe context)
        const targetWindow = window.parent !== window ? window.parent : window;
        const currentUrl = new URL(targetWindow.location.href);
        const hasQuestionParam = currentUrl.searchParams.has('question');
        
        // If we're in a question view but URL no longer has question param, close the view
        if (!hasQuestionParam) {
            const existingModal = document.querySelector('.question-modal');
            const existingDirectView = document.querySelector('.question-view');
            
            if (existingModal) {
                // Close modal without triggering URL cleanup (already done by back button)
                closeModal(existingModal);
                window.dispatchEvent(new CustomEvent('question-view-closed'));
            } else if (existingDirectView) {
                // Return to question list without triggering URL cleanup (already done by back button)
                existingDirectView.remove();
                const topBar = document.querySelector('.top-bar');
                const wrapper = document.querySelector('.question-cards-wrapper');
                if (topBar) topBar.classList.remove('d-none');
                if (wrapper) wrapper.classList.remove('d-none');
                scrollToSavedPosition();
                setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('question-view-closed'));
                }, 100);
            }
        }
    } catch (error) {
        // Fallback for cross-origin iframe restrictions
        console.warn('Could not access parent window for popstate handling:', error);
    }
};

window.addEventListener('popstate', handlePopState);
// Also listen on parent window if accessible (for iframe context)
try {
    if (window.parent !== window) {
        window.parent.addEventListener('popstate', handlePopState);
    }
} catch (error) {
    // Ignore cross-origin errors
}

// ----------------------------------
// MAIN EXPORT FUNCTION
// ----------------------------------

function handleQuestionView(questionId, questionLocation, directView, divId) {
    cleanupExistingViews();

    if (directView) {
        setupDirectQuestionView(questionId, questionLocation, divId);
    } else {
        setupModalQuestionView(questionId, divId);
    }
}

function cleanupExistingViews() {
    const existingModal = document.querySelector('.question-modal');
    const existingView = document.querySelector('.question-view');
    
    if (existingModal) existingModal.remove();
    if (existingView) existingView.remove();
}

function setupDirectQuestionView(questionId, questionLocation, divId) {
    const questionContainer = document.querySelector('#questions, #all-questions, #my-questions, #general-questions');
    initializeQuestionView(questionContainer, questionId, questionLocation, divId, true);

    document.querySelector('.top-bar').classList.add('d-none');
    document.querySelector('.question-cards-wrapper').classList.add('d-none');
}

function setupModalQuestionView(questionId, divId) {
    const questionModal = createElementFromTemplate(questionModalTemplate(questionId));
    document.body.appendChild(questionModal);
    
    const questionContainer = questionModal.querySelector('.content-wrapper');
    initializeQuestionView(questionContainer, questionId, QuestionLocation.COURSE, divId, false);
}

export {handleQuestionView};