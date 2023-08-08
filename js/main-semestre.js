/*
 * MAIN SEMESTRE PAGE JAVASCRIPT
 */

import {iframe} from './utils/iframe.js';
import {authButton} from './utils/auth';
import {sidebar} from './utils/sidebar';

document.addEventListener('DOMContentLoaded', () => {
  iframe();
  authButton();
  sidebar();
});