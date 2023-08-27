// ----------------------------------
// QUESTION LIST MODAL
// ----------------------------------

import {questionCardsWrapperTemplate} from './question-cards-wrapper';

const questionListModalTemplate = (divId, count) => `
<div class="modal question-list-modal" id="question-list-modal" data-bs-backdrop="false" data-bs-keyboard="false" tabindex="-1"
     aria-labelledby="modal-title" aria-hidden="true" data-div-id="${divId}">
    <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="question-list-modal-title" id="modal-title">Questions <span class="question-list-modal-title-badge">${count}</span></h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
            </div>
            <div class="modal-body">
                <div class="content-wrapper">
            
                    ${questionCardsWrapperTemplate(false)}
                    
                </div>
            </div>
        </div>
    </div>
</div>
`;

export {questionListModalTemplate};