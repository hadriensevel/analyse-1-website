/*
 * MAIN PAGE JAVASCRIPT
 */

// Imports
import {addClickListenerIframe, handleActiveState, loadIframe} from './utils/iframe.js';
import {changeWidth, setWidth, getWidthCookie, checkWidthCookie} from './utils/page-width.js';

// ----------------------------------
// IFRAME
// ----------------------------------

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

// ----------------------------------
// CHANGE PAGE WIDTH
// ----------------------------------

// Check if cookie with width exists and set width during page load
document.addEventListener('DOMContentLoaded', () => {
  const widthPlus = document.getElementById('width-plus');
  const widthMinus = document.getElementById('width-minus');
  widthPlus.addEventListener('click', () => changeWidth(1));
  widthMinus.addEventListener('click', () => changeWidth(-1));
  if (checkWidthCookie()) {
    const newWidth = getWidthCookie();
    setWidth(newWidth);
  }
});
