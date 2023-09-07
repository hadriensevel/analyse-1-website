/*
 * MAIN PAGE JAVASCRIPT
 */

import {iframe} from './utils/iframe.js';
import {initWidth} from './utils/width.js';
import {authentication} from './utils/auth';
import {sidebar} from './utils/sidebar';
import {getFeatureFlag} from './utils/feature-flags';

document.addEventListener('DOMContentLoaded', async () => {
  iframe();
  initWidth();
  sidebar();

  // Check if authentication is enabled
  const isAuthEnabled = await getFeatureFlag('authentication');
  if (isAuthEnabled) {
    authentication();
  }
});
