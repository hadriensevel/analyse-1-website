// ----------------------------------
// AUTHENTICATION
// ----------------------------------

import axios from 'axios';
import {baseUrl} from './config';

async function fetchAuthDetails() {
  try {
    const response = await axios.get(`${baseUrl}/auth/details`, {
      headers: {
        Accept: 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      return 401;
    } else return null;
  }
}

async function authButton() {
  const authData = await fetchAuthDetails();

  if (authData) {
    const usernameDiv = document.querySelector('.had-auth-info');
    const authButton = document.createElement('a');
    authButton.classList.add('had-auth-button');
    usernameDiv.appendChild(authButton);

    if (authData === 401) {
      // Display login button
      authButton.innerHTML = '<i class="had-auth-connect-icon"></i>';
      authButton.classList.add('icon-link');
      authButton.href = `${baseUrl}/auth/login?redirect=${window.location.href}`;
      const authLoginIcon = authButton.querySelector('i');
      authLoginIcon.dataset.bsToggle = 'tooltip';
      authLoginIcon.dataset.bsPlacement = 'bottom';
      authLoginIcon.dataset.bsTitle = 'Se connecter';
      new bootstrap.Tooltip(authLoginIcon);
    } else {
      // Display user details and logout button in popover
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
}

export {authButton};