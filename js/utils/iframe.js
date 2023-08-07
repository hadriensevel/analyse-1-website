// ----------------------------------
// IFRAME UTILS
// ----------------------------------

// Load iframe from url page parameter or handle sidebar buttons to change page in iframe
function iframe() {
  const buttons = document.querySelectorAll('.had-nav-link-toplevel, .had-nav-link-secondlevel');
  const page = new URLSearchParams(window.location.search).get('page');

  // Load iframe from url page parameter
  if (page) {
    const pageSidebarButton = document.getElementById(page);
    if (pageSidebarButton) {
      loadIframe(pageSidebarButton);
      pageSidebarButton.classList.add('active');
      new bootstrap.Collapse(pageSidebarButton.parentElement).show();
    }
  }

  // Handle sidebar buttons to change page in iframe
  buttons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();

      // Load iframe
      loadIframe(button);

      // Add active state
      const current = document.querySelector('.active');
      if (current) {
        current.classList.remove('active');
      }
      button.classList.add('active');

      // Close the sidebar (useful for mobile because otherwise the iframe is not visible)
      new bootstrap.Collapse(document.querySelector('.had-sidebar')).hide();
    });
  });
}

// Load iframe page
function loadIframe(el) {
  const targetUrl = el.querySelector('a').href;
  const historyUrl = `${window.location.pathname}?page=${el.id}`;
  const iframe = document.getElementById('iframe');
  iframe.setAttribute('src', targetUrl);
  window.history.pushState(null, null, historyUrl);
}

export {iframe};