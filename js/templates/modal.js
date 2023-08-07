// ----------------------------------
// FULLSCREEN MODAL
// ----------------------------------

const fullscreenModalTemplate = (modalId) => `
<div class="modal questions-modal" id="${modalId}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
     aria-labelledby="modal-title" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="questions-modal-title" id="modal-title">Questions <span class="questions-modal-title-badge">0</span></h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Card title</h5>
                        <h6 class="card-subtitle mb-2 text-body-secondary">Card subtitle</h6>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        <a href="#" class="card-link">Card link</a>
                        <a href="#" class="card-link">Another link</a>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary">Poser une question</button>
            </div>
        </div>
    </div>
</div>
`;

export {fullscreenModalTemplate};