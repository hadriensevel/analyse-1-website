// ----------------------------------
// TOOLTIPS UTILS
// ----------------------------------

// Enable tooltips everywhere
function enableTooltips() {
  const options = {
    html: true,
    placement: 'auto',
    container: 'body',
  }
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl, options))

  // Add a click event listener to trigger LaTeX rendering when the popover is shown
  tooltipList.forEach((tooltip) => {
    tooltip._element.addEventListener('shown.bs.tooltip', () => {
      renderMathInElement(document.querySelector('.tooltip'));
    });
  });
}

export {enableTooltips};