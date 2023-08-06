// ----------------------------------
// TEMPLATE UTILS
// ----------------------------------

// Create an element from a template string
function createElementFromTemplate(template) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = template;
  return tempDiv.firstElementChild;
}

export {createElementFromTemplate};