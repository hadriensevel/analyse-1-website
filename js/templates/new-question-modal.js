// ----------------------------------
// NEW QUESTION MODAL
// ----------------------------------

const newQuestionModalTemplate = (modalId) => `
<div class="modal new-question-modal" id="${modalId}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
     aria-labelledby="modal-title" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="question-modal-title" id="modal-title">Nouvelle question</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
            </div>
            <div class="modal-body">
                
            </div>
        </div>
    </div>
</div>
`;