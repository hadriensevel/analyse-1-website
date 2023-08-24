// ----------------------------------
// QUESTION LIST MODAL
// ----------------------------------

const questionListModalTemplate = (divId) => `
<div class="modal question-list-modal" id="question-list-modal" data-bs-backdrop="false" data-bs-keyboard="false" tabindex="-1"
     aria-labelledby="modal-title" aria-hidden="true" data-div-id="${divId}">
    <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="question-list-modal-title" id="modal-title">Questions <span class="question-list-modal-title-badge">0</span></h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
            </div>
            <div class="modal-body">
                <div class="content-wrapper">
            
                    <div class="question-cards-wrapper">
                        <div class="question-card-placeholder">
                            <h5 class="placeholder-glow">
                                <span class="placeholder col-6"></span>
                            </h5>
                            <div class="placeholder-glow">
                                <span class="placeholder col-2"></span>
                                <span class="placeholder col-1"></span>
                            </div>
                        </div>
                    
                        <div class="question-card-placeholder">
                            <h5 class="placeholder-glow">
                                <span class="placeholder col-5"></span>
                            </h5>
                            <div class="placeholder-glow">
                                <span class="placeholder col-1"></span>
                                <span class="placeholder col-3"></span>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
</div>
`;

export {questionListModalTemplate};