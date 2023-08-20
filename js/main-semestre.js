/*
 * MAIN SEMESTRE PAGE JAVASCRIPT
 */

import {iframe} from './utils/iframe.js';
import {authentication} from './utils/auth';
import {sidebar} from './utils/sidebar';
import {getFeatureFlag} from './utils/feature-flags';

document.addEventListener('DOMContentLoaded', () => {
  iframe();
  sidebar();

  // Check if authentication is enabled
  (async function() {
    const isAuthEnabled = await getFeatureFlag('authentication');
    if (isAuthEnabled) {
      authentication();
    }
  })();
});