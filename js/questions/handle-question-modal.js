// ----------------------------------
// HANDLE QUESTION MODAL
// ----------------------------------

import {createElementFromTemplate} from "../templates/utils.js";
import {questionModalTemplate} from "../templates/question-modal.js";

// Takes the modal template and appends it at the end of the body
function handleQuestionModal() {
  const questionModal = createElementFromTemplate(questionModalTemplate);
  document.body.appendChild(questionModal);
  questionModal.addEventListener('shown.bs.modal', (e) => {
    renderMathInElement(questionModal.querySelector('.modal-content'));
  });
}

export {handleQuestionModal};