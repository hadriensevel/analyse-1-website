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
function closeModal(modalElement) {
  if (!modalElement) return;
  const modalBootstrap = new bootstrap.Modal(modalElement);
  modalBootstrap.hide();
  modalBootstrap.dispose();
  modalElement.remove();
}

export {createElementFromTemplate, closeModal};