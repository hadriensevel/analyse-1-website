// ----------------------------------
// TEMPLATE UTILS
// ----------------------------------

// Create an element from a template string
function createElementFromTemplate(template) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = template;
  return tempDiv.firstElementChild;
}

// Close, dispose and remove the modal
function closeModal(modalElement, removeStyles = false) {
  if (!modalElement) return;
  const modalBootstrap = new bootstrap.Modal(modalElement);
  modalBootstrap.hide();
  modalBootstrap.dispose();
  modalElement.remove();

  // Ugly hack to remove the style added by bootstrap to the body for the modal
  if (removeStyles) {
    // Remove the remaining styles from the body
    document.body.removeAttribute('style');
  }
}

export {createElementFromTemplate, closeModal};