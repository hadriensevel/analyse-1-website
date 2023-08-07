// ----------------------------------
// INITIALIZE MODAL
// ----------------------------------

import {createElementFromTemplate} from "../templates/utils.js";
import {fullscreenModalTemplate} from "../templates/modal.js";

// Takes the modal template and appends it at the end of the body
function initModal() {
  const modal = createElementFromTemplate(fullscreenModalTemplate("questions-modal"));
  document.body.appendChild(modal);
}

export {initModal};