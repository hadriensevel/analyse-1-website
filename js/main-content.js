/*
 * CONTENT PAGE JAVASCRIPT
 */

import {plyrInit} from './utils/plyr';
import {quizzes} from './utils/quiz';
import {enablePopovers} from './utils/popovers';
import {enableTooltips} from './utils/tooltips';
import {animations} from './utils/anims';
import {tabs} from './utils/tabs';
import {rightIframeLink} from './utils/right-iframe-link';

document.addEventListener('DOMContentLoaded', () => {
  plyrInit();
  quizzes();
  enablePopovers();
  enableTooltips();
  animations();
  tabs();
  rightIframeLink();
});

// ----------------------------------
// QUESTIONS
// ----------------------------------

import {handleRightColumn} from './questions/handle-right-column';
import {handleQuestionModal} from './questions/handle-question-modal';
import {handleNewQuestionModal} from './questions/handle-new-question-modal';

document.addEventListener('DOMContentLoaded', () => {
  handleRightColumn();
  handleQuestionModal();
  handleNewQuestionModal()
});