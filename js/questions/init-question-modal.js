// ----------------------------------
// INITIALIZE MODAL
// ----------------------------------

import {createElementFromTemplate} from "../templates/utils.js";
import {questionModalTemplate} from "../templates/question-modal.js";

// Takes the modal template and appends it at the end of the body
function initQuestionModal() {
  const modal = createElementFromTemplate(questionModalTemplate("question-modal"));
  document.body.appendChild(modal);
  modal.addEventListener('shown.bs.modal', (e) => {
    renderMathInElement(modal.querySelector('.modal-content'));
  });
}

export {initQuestionModal};