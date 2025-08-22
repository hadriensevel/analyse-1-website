// ----------------------------------
// AUTHENTICATION
// ----------------------------------

import axios from 'axios';
import {baseUrl} from './config';

// Constants
const AUTH_STATUS = {
  UNAUTHORIZED: 401,
  SESSION_EXPIRED: 'session_expired',
  SERVER_ERROR: null
};

const COOKIE_CONFIG = {
  TOKEN_NAME: 'token',
  PATH: '/',
  SAME_SITE: 'Strict',
  SECURE: true,
  EXPIRES_PAST: 'Thu, 01 Jan 1970 00:00:01 GMT'
};

const USER_ROLES = {
  TEACHER: 'teacher',
  ASSISTANT: 'assistant'
};

const ROLE_DISPLAY = {
  [USER_ROLES.TEACHER]: 'Enseignant',
  [USER_ROLES.ASSISTANT]: 'Assistant'
};

const MESSAGES = {
  SESSION_EXPIRED: 'Votre session a expiré. Veuillez vous reconnecter.'
};

/**
 * Token Management
 */

/**
 * Decodes JWT token to extract user data
 * @param {string} token - JWT token to decode
 * @returns {Object|null} User data object or null if decoding fails
 */
function decodeJWT(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    const userData = {
      sciper: decoded.sciper,
      name: decoded.name,
      role: decoded.role,
      is_admin: Boolean(decoded.isadmin),
      exp: decoded.exp
    };
    
    return userData;
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return null;
  }
}

/**
 * Checks if token is expired locally (without backend call)
 * @param {string} token - JWT token to check
 * @returns {boolean} True if token is expired or invalid
 */
function isTokenExpired(token) {
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return true;
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
}

/**
 * Authentication Logic
 */

/**
 * Validates token with backend
 * @returns {Promise<Object|string|number|null>} User data, status code, or error state
 */
async function validateToken() {
  const token = getToken();
  if (!token) {
    return AUTH_STATUS.UNAUTHORIZED;
  }

  if (isTokenExpired(token)) {
    return await refreshToken();
  }

  try {
    const response = await axios.post(`${baseUrl}/auth/validate`, {}, {
      validateStatus: (status) => (status >= 200 && status < 300) || status === 401 || status === 403,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 401 || response.status === 403) {
      return await refreshToken();
    } else {
      return decodeJWT(token);
    }

  } catch (error) {
    console.error('Token validation error:', error);
    return AUTH_STATUS.SERVER_ERROR;
  }
}

/**
 * Refreshes authentication token
 * @returns {Promise<Object|string|number|null>} User data, status, or error state
 */
async function refreshToken() {
  const token = getToken();
  if (!token) {
    return AUTH_STATUS.UNAUTHORIZED;
  }

  try {
    const response = await axios.post(`${baseUrl}/auth/refresh`, {}, {
      validateStatus: (status) => (status >= 200 && status < 300) || status === 401 || status === 403,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 401 || response.status === 403) {
      return AUTH_STATUS.SESSION_EXPIRED;
    } else {
      const newToken = response.data.token;
      setTokenCookie(newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      return decodeJWT(newToken);
    }

  } catch (error) {
    console.error('Failed to refresh token:', error);
    return AUTH_STATUS.SERVER_ERROR;
  }
}

/**
 * Handles session expiration by showing alert and redirecting
 */
function showSessionExpiredAlert() {
  alert(MESSAGES.SESSION_EXPIRED);
  clearAuthenticationState();
  const loginButton = createLoginButton();
  window.location.href = loginButton.href;
}

/**
 * Clears all authentication state (cookie and headers)
 */
function clearAuthenticationState() {
  removeTokenCookie();
  removeTokenFromHeaders();
}

/**
 * UI Components
 */

/**
 * Creates base authentication button element
 * @returns {HTMLAnchorElement} Base auth button element
 */
function createAuthButton() {
  const authButton = document.createElement('a');
  authButton.classList.add('had-auth-button');
  return authButton;
}

/**
 * Gets current URL for redirect purposes, preserving page parameter
 * @returns {string} Encoded redirect URL
 */
function redirectUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page');
  const url = window.location.href.split('?')[0];
  if (page) return encodeURIComponent(`${url}?page=${page}`);
  else return encodeURIComponent(url);
}

/**
 * Creates login button with appropriate styling and tooltip
 * @returns {HTMLAnchorElement} Login button element
 */
function createLoginButton() {
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

/**
 * Attaches tooltip events to login button
 * @param {HTMLElement} button - Login button element
 */
function attachLoginEvents(button) {
  const authLoginIcon = button.querySelector('i');
  new bootstrap.Tooltip(authLoginIcon);
}

/**
 * Gets display name for user role
 * @param {string} role - User role key
 * @returns {string} Display name for role
 */
function getRoleDisplay(role) {
  return ROLE_DISPLAY[role] || '';
}

/**
 * Creates user details button with popover
 * @param {Object} authData - User authentication data
 * @returns {HTMLAnchorElement} User details button element
 */
function createUserDetailsButton(authData) {
  const authButton = createAuthButton();
  authButton.innerHTML = '<i class="had-auth-user-icon"></i>';
  authButton.classList.add('icon-link');
  const authUserIcon = authButton.querySelector('i');
  authUserIcon.dataset.bsToggle = 'popover';
  authUserIcon.dataset.bsPlacement = 'bottom';
  authUserIcon.dataset.bsTitle = authData.name;
  
  const roleDisplay = getRoleDisplay(authData.role);
  const currentToken = getToken();
  authUserIcon.dataset.bsContent = `
    <div class="had-user-role">${roleDisplay} ${authData.is_admin ? '(admin)' : ''}</div>
    <a id="logout-link" href="${baseUrl}/auth/logout${currentToken ? `?token=${currentToken}` : ''}${currentToken ? '&' : '?'}redirect=${redirectUrl()}">Se déconnecter</a>
  `;

  return authButton;
}

/**
 * Handles logout click event
 * @param {Event} event - Click event
 * @param {HTMLElement} logoutLink - Logout link element
 */
function handleLogoutClick(event, logoutLink) {
  event.preventDefault();
  clearAuthenticationState();
  window.location.href = logoutLink.getAttribute('href');
}

/**
 * Attaches popover and logout events to user details button
 * @param {HTMLElement} button - User details button element
 */
function attachUserDetailsEvents(button) {
  const authUserIcon = button.querySelector('i');
  new bootstrap.Popover(authUserIcon, {
    container: 'body',
    html: true,
  });

  authUserIcon.addEventListener('shown.bs.popover', () => {
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
      logoutLink.addEventListener('click', (event) => handleLogoutClick(event, logoutLink));
    }
  });
}

/**
 * Cookie Management
 */

/**
 * Gets token from cookie
 * @returns {string|null} Token value or null if not found
 */
function getToken() {
  const cookieToken = document.cookie.split('; ').find(row => row.startsWith(`${COOKIE_CONFIG.TOKEN_NAME}=`));
  return cookieToken ? cookieToken.split('=')[1] : null;
}

/**
 * Sets token in cookie with security configurations
 * @param {string} token - JWT token to store
 */
function setTokenCookie(token) {
  document.cookie = `${COOKIE_CONFIG.TOKEN_NAME}=${token}; path=${COOKIE_CONFIG.PATH}; SameSite=${COOKIE_CONFIG.SAME_SITE}; secure`;
}

/**
 * Removes token from cookie
 */
function removeTokenCookie() {
  document.cookie = `${COOKIE_CONFIG.TOKEN_NAME}=; expires=${COOKIE_CONFIG.EXPIRES_PAST}; path=${COOKIE_CONFIG.PATH};`;
}

/**
 * Sets token in axios default headers
 */
function setTokenInHeaders() {
  const token = getToken();
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

/**
 * Removes token from axios default headers
 */
function removeTokenFromHeaders() {
  delete axios.defaults.headers.common['Authorization'];
}


/**
 * Main Authentication Functions
 */

/**
 * Gets authentication for iframe context
 * @returns {Promise<Object|string|number|null>} Authentication result
 */
async function iframeAuthentication() {
  setTokenInHeaders();
  return await validateToken();
}

/**
 * Processes URL token parameter and stores in cookie
 */
function processUrlToken() {
  const token = new URLSearchParams(window.location.search).get('token');
  
  if (token) {
    setTokenCookie(token);
    
    const url = window.location.href.split('?')[0];
    const params = new URLSearchParams(window.location.search);
    params.delete('token');
    const paramsString = params.toString() ? `?${params.toString()}` : '';
    const newUrl = `${url}${paramsString}`;
    window.history.replaceState({}, '', newUrl);
  }
}

/**
 * Creates and attaches appropriate auth button based on auth result
 * @param {Object|string|number|null} result - Authentication result
 * @param {HTMLElement} container - Container element for the button
 * @returns {HTMLElement|null} Created button element or null
 */
function createAuthButtonForResult(result, container) {
  let authButton;
  
  if (result === AUTH_STATUS.UNAUTHORIZED) {
    authButton = createLoginButton();
    attachLoginEvents(authButton);
  } else {
    authButton = createUserDetailsButton(result);
    attachUserDetailsEvents(authButton);
  }
  
  container.appendChild(authButton);
  return authButton;
}

/**
 * Main authentication function - handles complete auth flow
 * @returns {Promise<void>}
 */
async function authentication() {
  processUrlToken();
  setTokenInHeaders();

  const result = await validateToken();
  const usernameDiv = document.querySelector('.had-auth-info');

  if (result === AUTH_STATUS.SERVER_ERROR) {
    return;
  }

  if (result === AUTH_STATUS.SESSION_EXPIRED) {
    showSessionExpiredAlert();
    return;
  }

  const authButton = createAuthButtonForResult(result, usernameDiv);

  const sidebarMenuFooter = document.querySelector('.had-footer');
  if (sidebarMenuFooter && authButton) {
    const sidebarAuthButton = authButton.cloneNode(true);
    if (result === AUTH_STATUS.UNAUTHORIZED) {
      attachLoginEvents(sidebarAuthButton);
    } else {
      attachUserDetailsEvents(sidebarAuthButton);
    }
    sidebarMenuFooter.appendChild(sidebarAuthButton);
  }
}

export {authentication, iframeAuthentication, validateToken, decodeJWT, isTokenExpired};
