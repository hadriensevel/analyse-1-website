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

      if (parent.window.innerWidth >= 1400) {
        // If the parent window's inner width is greater than or equal to 1400 pixels
        // (i.e. the window is large enough to display the right iframe)
        // then change the right iframe's src attribute
        rightIframe.setAttribute('src', link.href);
      } else {
        // Otherwise, open the link in a new tab
        window.open(link.href, '_blank')
      }
    });
  });
}

export {rightIframeLink};