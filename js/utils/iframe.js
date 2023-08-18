// ----------------------------------
// IFRAME UTILS
// ----------------------------------

// Change iframe src and push state to history
function loadIframe(el) {
  const targetUrl = el.querySelector('a').href;
  const historyUrl = `${window.location.pathname}?page=${el.id}`;
  const iframe = document.getElementById('iframe');
  if (iframe) {
    iframe.setAttribute('src', targetUrl);
  }
  window.history.pushState(null, null, historyUrl);
}

// Set active state to sidebar button
function setActiveState(button) {
  const current = document.querySelector('.active');
  if (current) {
    current.classList.remove('active');
  }
  button.classList.add('active');
}

// Close the sidebar
function closeSidebar() {
  new bootstrap.Collapse(document.querySelector('.had-sidebar')).hide();
}

// Load iframe from url page parameter or handle sidebar buttons to change page in iframe
function iframe() {
  const sidebar = document.querySelector('.had-sidebar');
  const page = new URLSearchParams(window.location.search).get('page');

  // Load iframe from url page parameter
  if (page) {
    const pageSidebarButton = document.getElementById(page);
    if (pageSidebarButton) {
      loadIframe(pageSidebarButton);
      setActiveState(pageSidebarButton);
      new bootstrap.Collapse(pageSidebarButton.parentElement).show();
    }
  }

  // Handle sidebar buttons to change page in iframe using event delegation
  sidebar.addEventListener('click', (e) => {
    const button = e.target.closest('.had-nav-link-toplevel, .had-nav-link-secondlevel');
    if (!button) return;

    e.preventDefault();

    loadIframe(button);
    setActiveState(button);
    closeSidebar();
  });
}

export {iframe};