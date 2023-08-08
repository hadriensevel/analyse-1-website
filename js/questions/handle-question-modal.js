// ----------------------------------
// HANDLE THE MODAL FOR A QUESTION
// ----------------------------------

import {createElementFromTemplate} from "../templates/utils.js";
import {questionModalTemplate} from "../templates/question-modal.js";

function handleQuestionModal() {
  const questionModal = createElementFromTemplate(questionModalTemplate);
  document.body.appendChild(questionModal);
  questionModal.addEventListener('shown.bs.modal', (e) => {
    renderMathInElement(questionModal.querySelector('.modal-content'));
  });
}