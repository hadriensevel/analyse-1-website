// ----------------------------------
// AUTHENTICATION FOR QUESTIONS
// ----------------------------------

import {baseUrl} from '../utils/config';

// Authentication details
let authData = null;

// Get authentication details
function getAuthData() {
  return authData;
}

// When we receive a message from the main page
const listenAuthMessage = () => {
  window.addEventListener('message', (e) => {
    if (e.origin !== baseUrl) {
      return;
    }

    if (e.data && e.data.authDetails) {
      // If authData is 401, we replace it with null
      if (e.data.authDetails === 401) {
        authData = null;
        return;
      }
      // We store the authentication details we received
      authData = e.data.authDetails;
    }
  });
}

export {listenAuthMessage, getAuthData};