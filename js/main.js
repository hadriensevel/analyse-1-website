/*
 * MAIN PAGE JAVASCRIPT
 */

// Imports
import {loadIframeInit} from './utils/iframe.js';
import {changeWidth, setWidth, getWidthCookie, checkWidthCookie} from './utils/page-width.js';
import {fetchAuthDetails} from './utils/auth';

// ----------------------------------
// IFRAME
// ----------------------------------

// Function to load iframe from url parameters and when clicking on a button
document.addEventListener('DOMContentLoaded', () => {
  loadIframeInit();
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

// ----------------------------------
// AUTHENTICATION
// ----------------------------------

// Fetch authentication details
document.addEventListener('DOMContentLoaded', () => {
    const data = fetchAuthDetails();
    console.log(data);
});