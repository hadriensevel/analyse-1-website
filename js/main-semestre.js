/*
 * MAIN PAGE JAVASCRIPT
 */

import {addClickListenerIframe, handleActiveState, loadIframe} from './utils/iframe.js';

// Load iframe with url parameters
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const section = urlParams.get('section');
  const element = urlParams.get('element');
  const number = urlParams.get('numero');
  if (section != null) {
    loadIframe(section, true);
    // if (element != null) {
    //   loadIframe(`${section}.html?element=${element}&numero=${number}`, true);
    // } else {
    //   loadIframe(section, true);
    // }
  }
});

// Function to load iframe when clicking on a button
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.liSubMenu');
  const section = new URLSearchParams(window.location.search).get('section');

  buttons.forEach(button => {
    addClickListenerIframe(button);
    handleActiveState(button, section);
  });
});