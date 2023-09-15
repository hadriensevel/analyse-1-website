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
import {handleRightColumn} from './questions/handle-right-column';
import {iframeAuthentication} from './utils/auth';
import {getFeatureFlag} from './utils/feature-flags';
import {authentication} from './utils/auth';

document.addEventListener('DOMContentLoaded', () => {
  plyrInit();
  quizzes();
  enablePopovers();
  enableTooltips();
  animations();
  tabs();
  rightIframeLink();

  // Check if authentication and questions are enabled
  (async function() {
    const isAuthEnabled = await getFeatureFlag('authentication');
    const areQuestionsEnabled = await getFeatureFlag('questions');
    if (isAuthEnabled) {
      iframeAuthentication();
    }
    if (areQuestionsEnabled) {
      handleRightColumn();
    }
  })();
});
