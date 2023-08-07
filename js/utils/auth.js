// ----------------------------------
// AUTHENTICATION
// ----------------------------------

import axios from 'axios';
import {baseUrl} from './config';

// Fetch authentication details
async function fetchAuthDetails() {
  try {
    const response = await axios.get(`${baseUrl}/auth/details`, {
      headers: {
        Accept: 'application/json',
      },
    });

    // User is logged in, we return the data
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // If error is 401, it means that authentication is working
      // but the user is not logged in
      return 401;
    } else {
      // If error is not 401, it means that authentication is not working
      // (e.g. server is down) so we return null
      return null;
    }
  }
}

// Display the user details or the login button
async function authButton() {
  const authData = await fetchAuthDetails();

  if (authData) {
    // If authData is not null, it means that authentication is working,
    // so we display the user details or the login button
    const usernameDiv = document.querySelector('.had-auth-info');
    const authButton = document.createElement('a');
    authButton.classList.add('had-auth-button');
    usernameDiv.appendChild(authButton);

    if (authData === 401) {
      // If authData is 401, it means that the user is not logged in,
      // so we display the login button
      authButton.innerHTML = '<i class="had-auth-connect-icon"></i>';
      authButton.classList.add('icon-link');
      authButton.href = `${baseUrl}/auth/login?redirect=${window.location.href}`;
      const authLoginIcon = authButton.querySelector('i');
      authLoginIcon.dataset.bsToggle = 'tooltip';
      authLoginIcon.dataset.bsPlacement = 'bottom';
      authLoginIcon.dataset.bsTitle = 'Se connecter';
      new bootstrap.Tooltip(authLoginIcon);
    } else {
      // If authData is not 401, it means that the user is logged in,
      // so we display the user details
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
    }
  }
  // If authData is null, it means that authentication is not working,
  // so we do nothing
}

export {authButton};