// ----------------------------------
// SCROLL TO DIV
// ----------------------------------

function scrollToDiv() {
  let divId = new URLSearchParams(window.location.search).get('div');
  if (!divId) return;

  // If divId starts with a number, escape it
  const divIdStartsWithNumber = /^\d/.test(divId);
  if (divIdStartsWithNumber) divId = `\\3${divId}`;

  const divElement = document.querySelector(`#${divId} .div-container`);
  if (divElement) {
    divElement.scrollIntoView({behavior: 'smooth', block: 'start'});
    divElement.style.outline = '2px solid #FFC107';
  }
}

export {scrollToDiv};
