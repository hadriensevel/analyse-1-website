// ----------------------------------
// INITIALIZE MODAL
// ----------------------------------

import {createElementFromTemplate} from "../templates/utils.js";
import {questionModalTemplate} from "../templates/questions-modal.js";

// Takes the modal template and appends it at the end of the body
function initQuestionsModal() {
  const modal = createElementFromTemplate(questionModalTemplate("questions-modal"));
  document.body.appendChild(modal);
}

export {initQuestionsModal};