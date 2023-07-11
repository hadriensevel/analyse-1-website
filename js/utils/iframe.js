// ----------------------------------
// IFRAME UTILS
// ----------------------------------

// Function for loading a given section into an iframe.
// The iframe source and URL history state are updated based on the section provided.
function loadIframe(el, sectionGiven = false) {
  const section = sectionGiven ? el : el.parentElement.id;
  const baseUrl = 'sections/';
  const url = `${baseUrl}${section}.html`;
  const historyUrl = `${window.location.pathname}?section=${section}`;
  const iframe = document.getElementById('iframe');
  const iframeCurrentSection = new URL(iframe.src).pathname.split('/').slice(-1)[0].replace('.html', '');
  if (iframeCurrentSection !== section) {
    iframe.setAttribute('src', url);
    window.history.pushState(null, null, historyUrl);
  }
}

// Function for adding a click listener to a button that loads the iframe.
function addClickListenerIframe(button) {
  button.querySelector('a').addEventListener('click', function(event) {
    event.preventDefault(); // prevent the default action
    loadIframe(this, false); // call the loadIframe function
  });

  button.addEventListener('click', () => {
    const current = document.getElementsByClassName('active');
    if (current.length) {
      current[0].className = current[0].className.replace(' active', '');
    }
    button.className += ' active';
    // Close the sidebar
    new bootstrap.Collapse(document.querySelector('.had-sidebar')).hide();
  });
}

// Function to handle the active state of a button and its section.
function handleActiveState(button, section) {
  if (button.id === section) {
    button.className += ' active';
    new bootstrap.Collapse(button.parentElement).show();
  }
}

export {addClickListenerIframe, handleActiveState, loadIframe};