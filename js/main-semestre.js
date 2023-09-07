/*
 * MAIN SEMESTRE PAGE JAVASCRIPT
 */

import {iframe} from './utils/iframe.js';
import {authentication} from './utils/auth';
import {sidebar} from './utils/sidebar';
import {getFeatureFlag} from './utils/feature-flags';
import {rightIframeMenu} from './utils/right-iframe-menu';

document.addEventListener('DOMContentLoaded', async () => {
  iframe();
  sidebar();
  rightIframeMenu();

  // Check if authentication is enabled
  const isAuthEnabled = await getFeatureFlag('authentication');
  if (isAuthEnabled) {
    authentication();
  }

});