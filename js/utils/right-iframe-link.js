// ----------------------------------
// LINK TO CHANGE RIGHT IFRAME
// ----------------------------------

function rightIframeLink() {
  const links = document.querySelectorAll('.right-iframe-link');
  const rightIframe = parent.document.getElementById('right-iframe');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      rightIframe.setAttribute('src', link.href);
    });
  });
}

export {rightIframeLink};