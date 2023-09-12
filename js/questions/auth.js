// ----------------------------------
// AUTHENTICATION FOR QUESTIONS
// ----------------------------------

import {getTokenFromSessionStorage, fetchAuthDetails, authentication} from '../utils/auth';

let authData = null;

// Get authentication details
function getAuthData() {
  return authData;
}

// Get authentication from server
async function iframeAuthentication() {
  getTokenFromSessionStorage();
  authData = await fetchAuthDetails();
  authData = authData === 401 ? null : authData;
}

// When we receive a message from the main page
const listenAuthMessage = () => {
  window.addEventListener('message', (e) => {
    const url = window.location.href.split('/').slice(0, 3).join('/');
    if (e.origin !== url) {
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

    if (e.data && e.data.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${e.data.token}`;
    }
  });
}

export {iframeAuthentication, listenAuthMessage, getAuthData};