/*
 * MAIN PAGE JAVASCRIPT
 */

import {iframe} from './utils/iframe.js';
import {initWidth} from './utils/width.js';
import {authButton} from './utils/auth';
import {sidebar} from './utils/sidebar';

document.addEventListener('DOMContentLoaded', () => {
  iframe();
  initWidth();
  authButton();
  sidebar();
});
