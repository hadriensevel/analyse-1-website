/*
 * CONTENT PAGE JAVASCRIPT
 */

import {plyrInit} from './utils/plyr';
import {quizUserAnswers} from './utils/quiz';

document.addEventListener('DOMContentLoaded', () => {
  plyrInit();
  quizUserAnswers();
});