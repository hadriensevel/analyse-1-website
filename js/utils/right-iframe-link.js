// ----------------------------------
// LINK TO CHANGE RIGHT IFRAME
// ----------------------------------

// This function is used to change the right iframe's src attribute
// when the user clicks on a link in the left iframe
function rightIframeLink() {
  const links = document.querySelectorAll('.right-iframe-link');
  const rightIframe = parent.document.querySelector('#right-iframe');

  links.forEach(link => {

    // Add event listener to each link
    link.addEventListener('click', (e) => {

      // Prevent the link default behavior
      e.preventDefault();

      // Use window.matchMedia() to test if the window is large enough to display the right iframe
      if (parent.window.matchMedia("(min-width: 1400px)").matches) {
        // Change the right iframe's src attribute
        rightIframe.setAttribute('src', link.href);
      } else {
        // Otherwise, open the link in a new tab
        window.open(link.href, '_blank')
      }
    });
  });
}

export {rightIframeLink};