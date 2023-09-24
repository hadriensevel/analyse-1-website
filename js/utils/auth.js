// ----------------------------------
// AUTHENTICATION
// ----------------------------------

import axios from 'axios';
import {baseUrl} from './config';

let authData = null;

function getAuthData() {
  return authData;
}

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
  if (token) tokenParam = `&token=${token}`;
  const authButton = createAuthButton();
  authButton.innerHTML = '<i class="had-auth-connect-icon"></i>';
  authButton.classList.add('icon-link');
  authButton.href = `${baseUrl}/auth/login?redirect=${redirectUrl()}${tokenParam}`;
  const authLoginIcon = authButton.querySelector('i');
  authLoginIcon.dataset.bsToggle = 'tooltip';
  authLoginIcon.dataset.bsPlacement = 'bottom';
  authLoginIcon.dataset.bsTitle = 'Se connecter';
  return authButton;
}

function attachLoginEvents(button) {
  const authLoginIcon = button.querySelector('i');
  new bootstrap.Tooltip(authLoginIcon);
}

function createUserDetailsButton(authData) {
  const authButton = createAuthButton();
  authButton.innerHTML = '<i class="had-auth-user-icon"></i>';
  authButton.classList.add('icon-link');
  const authUserIcon = authButton.querySelector('i');
  authUserIcon.dataset.bsToggle = 'popover';
  authUserIcon.dataset.bsPlacement = 'bottom';
  authUserIcon.dataset.bsTitle = authData.name;
  const role = (() => {
    switch (authData.role) {
      case 'teacher':
        return 'Enseignant';
      case 'assistant':
        return 'Assistant';
      default:
        return '';
    }
  });
  authUserIcon.dataset.bsContent = `
    <div class="had-user-role">${role()} ${authData.is_admin ? '(admin)' : ''}</div>
    <a id="logout-link" href="${baseUrl}/auth/logout?redirect=${redirectUrl()}">Se déconnecter</a>
  `;

  return authButton;
}

function attachUserDetailsEvents(button) {
  const authUserIcon = button.querySelector('i');
  new bootstrap.Popover(authUserIcon, {
    container: 'body',
    html: true,
  });

  authUserIcon.addEventListener('shown.bs.popover', () => {
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
      logoutLink.addEventListener('click', function(event) {
        // Prevent the default action of the link
        event.preventDefault();
        // Delete the token cookie
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;';
        // Remove the token from the headers of the requests
        delete axios.defaults.headers.common['Authorization'];
        // Navigate to the logout page
        window.location.href = logoutLink.getAttribute('href');
      });
    }
  });
}

function getTokenFromCookie() {
  // Get token from cookie
  const cookieToken = document.cookie.split('; ').find(row => row.startsWith('token='));
  if (cookieToken) {
    // Add the token to the headers of the requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${cookieToken.split('=')[1]}`;
  }
}

// Get authentication from server
async function iframeAuthentication() {
  getTokenFromCookie();
  authData = await fetchAuthDetails();
  authData = authData === 401 ? null : authData;
}

async function authentication() {
  // Get the token parameter in the URL if there is one, store it in localStorage and remove it from the URL
  const token = new URLSearchParams(window.location.search).get('token');


  if (token) {
    // Store the token in a session cookie
    document.cookie = `token=${token}; path=/; SameSite=Strict; secure`;

    // Remove the token from the URL but keep the other parameters
    const url = window.location.href.split('?')[0];
    const params = new URLSearchParams(window.location.search);
    params.delete('token');
    const paramsString = params.toString() ? `?${params.toString()}` : '';
    const newUrl = `${url}${paramsString}`;
    window.history.replaceState({}, '', newUrl);
  }

  getTokenFromCookie();

  const authData = await fetchAuthDetails();
  const usernameDiv = document.querySelector('.had-auth-info');
  let authButton;

  if (authData === null) {
    return; // Authentication not working, do nothing
  }

  if (authData === 401) {
    authButton = createLoginButton();
    attachLoginEvents(authButton);
  } else {
    authButton = createUserDetailsButton(authData);
    attachUserDetailsEvents(authButton);
  }

  usernameDiv.appendChild(authButton);

  // Add the button in the sidebar for mobile
  const sidebarMenuFooter = document.querySelector('.had-footer');
  if (sidebarMenuFooter) {
    const sidebarAuthButton = authButton.cloneNode(true);
    if (authData === 401) {
      attachLoginEvents(sidebarAuthButton);
    } else {
      attachUserDetailsEvents(sidebarAuthButton);
    }
    sidebarMenuFooter.appendChild(sidebarAuthButton);
  }
}

export {authentication, iframeAuthentication, fetchAuthDetails, getAuthData};
