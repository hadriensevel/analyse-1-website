// ----------------------------------
// QUESTION MODAL
// ----------------------------------

const questionModalTemplate = (questionId) => `
<div class="modal question-modal" id="question-modal" data-bs-backdrop="false" data-bs-keyboard="false" tabindex="-1"
     aria-labelledby="modal-title" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
            <div class="modal-header">
                <a class="back-button" href="#" data-bs-dismiss="modal" aria-label="Retour"></a>
                <!--<h1 class="modal-title-h1" id="modal-title">Titre de la question</h1>-->
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
            </div>
            <div class="modal-body">
            
                <!--<h1>Titre de la question</h1>
                
                <form novalidate>
                    <input type="hidden" name="div-id" value="${questionId}">
                    <div class="mb-3">
                        <label for="answerText" class="form-label">Réponse</label>
                        <textarea class="form-control" name="question-text" required></textarea>
                        <div class="invalid-feedback">Merci d'écrire ici votre question.</div>
                    </div>
                    <button type="submit" class="send-button">Envoyer</button>
                </form>-->
                
            </div>
        </div>
    </div>
</div>
`;

export {questionModalTemplate};