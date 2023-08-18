// ----------------------------------
// NEW QUESTION MODAL
// ----------------------------------

const newQuestionModalTemplate = (divId) => `
<div class="modal new-question-modal" id="new-question-modal" data-bs-backdrop="false" data-bs-keyboard="false" tabindex="-1"
     aria-labelledby="modal-title" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
            <div class="modal-header">
                <a class="back-button" href="#" data-bs-dismiss="modal" aria-label="Retour"></a>
                <h1 class="modal-title-h1" id="modal-title">Nouvelle question</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
            </div>
            <div class="modal-body">
                
                <form novalidate>
                    <input type="hidden" name="div-id" value="${divId}">
                    <div class="mb-3">
                        <label for="question-title" class="form-label">Titre de la question</label>
                        <input type="text" class="form-control" name="question-title" required>
                        <div class="invalid-feedback">Merci de donner un titre à votre question.</div>
                    </div>
                    <div class="mb-3">
                        <label for="question-text" class="form-label">Question</label>
                        <textarea class="form-control" name="question-text" required></textarea>
                        <div class="invalid-feedback">Merci d'écrire ici votre question.</div>
                    </div>
                    <button type="submit" class="send-button">Envoyer</button>
                </form>
                
                <div class="toast form-toast success" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body">La question a été envoyée!</div>
                        <button type="button" data-bs-dismiss="toast" aria-label="Fermer"></button>
                    </div>
                </div>
                
                <div class="toast form-toast error" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body">Erreur, la question n'a pas été envoyée...</div>
                        <button type="button" data-bs-dismiss="toast"" aria-label="Fermer"></button>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
</div>
`;

export {newQuestionModalTemplate};