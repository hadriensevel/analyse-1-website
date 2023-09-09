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
      }
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

function redirectUrl() {
  // Get page parameter in the URL
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page');
  // Get the url without the parameters
  const url = window.location.href.split('?')[0];
  if (page) return encodeURIComponent(`${url}?page=${page}`);
  else return encodeURIComponent(url);
}

function createLoginButton() {
  // Get token parameter in the URL
  const token = new URLSearchParams(window.location.search).get('token');
  let tokenParam = '';
  if(token) tokenParam = `&token=${token}`;
  const authButton = createAuthButton();
  authButton.innerHTML = '<i class="had-auth-connect-icon"></i>';
  authButton.classList.add('icon-link');
  authButton.href = `${baseUrl}/auth/login?redirect=${redirectUrl()}${tokenParam}`;
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
  authUserIcon.dataset.bsContent = `<a href="${baseUrl}/auth/logout?redirect=${redirectUrl()}">Se déconnecter</a>`;
  new bootstrap.Popover(authUserIcon, {
    container: 'body',
    html: true,
  });
  return authButton;
}

function sendMessageToIframe(iframeId, authData, token) {
  const iframe = document.getElementById(iframeId);
  const url = window.location.href.split('/').slice(0, 3).join('/');
  if (iframe) {
    iframe.onload = () => {
      console.log('Sending message to iframe', authData, token)
      iframe.contentWindow.postMessage({ authDetails: authData, token: token }, url);
    };
  }
}

async function authentication() {
  // Get the token parameter in the URL if there is one, store it in localStorage and remove it from the URL
  const token = new URLSearchParams(window.location.search).get('token');
  if (token) {
    // Store the token in localStorage
    sessionStorage.setItem('token', token);

    // Remove the token from the URL but keep the other parameters
    const url = window.location.href.split('?')[0];
    const params = new URLSearchParams(window.location.search);
    params.delete('token');
    const paramsString = params.toString() ? `?${params.toString()}` : '';
    const newUrl = `${url}${paramsString}`;
    window.history.replaceState({}, '', newUrl);
  }

  // Get token from localStorage
  const sessionStorageToken = sessionStorage.getItem('token');
  if (sessionStorageToken) {
    // Add the token to the headers of the requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${sessionStorageToken}`;
  }

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

  sendMessageToIframe("iframe", authData, sessionStorageToken);
  sendMessageToIframe("right-iframe", authData, sessionStorageToken);
}

export {authentication};
