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