/*
 * MAIN PAGE JAVASCRIPT
 */

// Update iframe src and history
function loadIframe(el, sectionGiven = false) {
  const section = sectionGiven ? el : el.parentElement.id;
  const baseUrl = 'sections/';
  const url = baseUrl + section + '.html';
  const historyUrl = window.location.pathname + '?section=' + section;
  const iframe = document.getElementById('iframe');
  const iframeCurrentSection = new URL(iframe.src).pathname.split('/').slice(-1)[0].replace('.html', '');
  if (iframeCurrentSection !== section) {
    iframe.setAttribute('src', url);
    window.history.pushState(null, null, historyUrl);
  }
  return false;
}

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

// Color active menu item and close menu on mobile when clicked
document.addEventListener('DOMContentLoaded', () => {
  const btns = document.getElementsByClassName('liSubMenu');
  const section = new URLSearchParams(window.location.search).get('section');
  for (let i = 0; i < btns.length; i++) {
    if (btns[i].id === section) {
      btns[i].className += ' active';
      new bootstrap.Collapse(btns[i].parentElement).show();
    }
    btns[i].addEventListener('click', function () {
      const current = document.getElementsByClassName('active');
      if (current.length > 0) {
        current[0].className = current[0].className.replace(' active', '');
      }
      this.className += ' active';
      // Close the sidebar
      new bootstrap.Collapse(document.querySelector('.had-sidebar')).hide();
    });
  }
});

// ----------------------------------
// CHANGE WIDTH
// ----------------------------------

// Change width of the page with buttons
function changeWidth(a) {
  const bodyWidth = document.querySelector('body').style;
  const width = bodyWidth.maxWidth ? parseInt(bodyWidth.maxWidth) : 800;
  let newWidth = width + a * 250;
  if (newWidth < 800) newWidth = 800;
  if (newWidth > window.innerWidth) newWidth = window.innerWidth;
  setWidth(newWidth);
  setWidthCookie(newWidth);
}

// Set width of the page
function setWidth(width) {
  const bodyWidth = document.querySelector('body').style;
  bodyWidth.setProperty('max-width', width + 'px');
}

// Set cookie with width
function setWidthCookie(width) {
  const d = new Date();
  const numberOfDays = 200;
  d.setTime(d.getTime() + (numberOfDays * 24 * 60 * 60 * 1000));
  const expires = 'expires=' + d.toUTCString();
  document.cookie = 'width=' + width + ';' + expires + ';path=/';
}

// Get cookie with width
function getWidthCookie() {
  const name = 'width=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

// Check if cookie with width exists
function checkWidthCookie() {
  const width = getWidthCookie('width');
  return width !== '';
}

// Check if cookie with width exists and set width during page load
document.addEventListener('DOMContentLoaded', () => {
  if (checkWidthCookie()) {
    const newWidth = getWidthCookie();
    setWidth(newWidth);
  }
});
