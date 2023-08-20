// ----------------------------------
// AUTHENTICATION
// ----------------------------------

import axios from 'axios';
import {baseUrl} from './config';

// Fetch authentication details
async function fetchAuthDetails() {
  try {
    const response = await axios.get(`${baseUrl}/auth/details`, {
      validateStatus: function (status) {
        return (status >= 200 && status < 300) || status === 401;
      },
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.status === 401) {
      // If user is not logged in, we return 401
      return 401;
    } else {
      // If user is logged in, we return the data
      return response.data;
    }

  } catch (error) {
      // If there's an error, it means that authentication is not working
      // (e.g. server is down) so we return null
      return null;
  }
}

function createAuthButton(authData) {
  const authButton = document.createElement('a');
  authButton.classList.add('had-auth-button');
  return authButton;
}

function createLoginButton() {
  const authButton = createAuthButton();
  authButton.innerHTML = '<i class="had-auth-connect-icon"></i>';
  authButton.classList.add('icon-link');
  authButton.href = `${baseUrl}/auth/login?redirect=${window.location.href}`;
  const authLoginIcon = authButton.querySelector('i');
  authLoginIcon.dataset.bsToggle = 'tooltip';
  authLoginIcon.dataset.bsPlacement = 'bottom';
  authLoginIcon.dataset.bsTitle = 'Se connecter';
  new bootstrap.Tooltip(authLoginIcon);
  return authButton;
}

function createUserDetailsButton(authData) {
  const authButton = createAuthButton();
  authButton.innerHTML = '<i class="had-auth-user-icon"></i>';
  authButton.classList.add('icon-link');
  const authUserIcon = authButton.querySelector('i');
  authUserIcon.dataset.bsToggle = 'popover';
  authUserIcon.dataset.bsPlacement = 'bottom';
  authUserIcon.dataset.bsTitle = authData.name;
  authUserIcon.dataset.bsContent = `<a href="${baseUrl}/auth/logout?redirect=${window.location.href}">Se déconnecter</a>`;
  new bootstrap.Popover(authUserIcon, {
    container: 'body',
    html: true,
  });
  return authButton;
}

function sendMessageToIframe(iframeId, authData) {
  const iframe = document.getElementById(iframeId);
  if (iframe) {
    iframe.onload = () => {
      iframe.contentWindow.postMessage({ authDetails: authData }, baseUrl);
    };
  }
}

async function authentication() {
  const authData = await fetchAuthDetails();
  const usernameDiv = document.querySelector('.had-auth-info');
  let authButton;

  if (authData === null) {
    return; // Authentication not working, do nothing
  }

  if (authData === 401) {
    authButton = createLoginButton();
  } else {
    authButton = createUserDetailsButton(authData);
  }

  usernameDiv.appendChild(authButton);

  sendMessageToIframe("iframe", authData);
  sendMessageToIframe("right-iframe", authData);
}

export {authentication};
