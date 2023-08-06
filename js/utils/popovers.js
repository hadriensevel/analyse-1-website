// ----------------------------------
// POPOVERS UTILS
// ----------------------------------

// Enable popovers everywhere
function enablePopovers() {
  const options = {
    html: true,
    placement: 'auto',
    trigger: 'focus'
  }
  const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
  const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl, options));

  // Add a click event listener to trigger LaTeX rendering when the popover is shown
  popoverList.forEach((popover) => {
    popover._element.addEventListener('shown.bs.popover', () => {
      renderMathInElement(document.querySelector('.popover-header'));
      renderMathInElement(document.querySelector('.popover-body'));
    });
  });
}

export {enablePopovers};