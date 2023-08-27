// ----------------------------------
// QUESTION MODAL
// ----------------------------------

const questionAnswersTemplate = (answer) => `
<div class="answer" data-answer-id="${answer.id}">
    ${answer.body}
    <div class="answer-footer">
        ${answer.accepted ? '<div class="answer-accepted" title="Réponse acceptée"></div>' : ''}
        ${answer.user_role}
        <div class="answer-date">${answer.date}</div>
    </div>
</div>
`;

const answerFormTemplate = () => `
<form novalidate>
    <div class="mb-3">
        <label for="answer-body" class="form-label">Ajouter une réponse ou un commentaire</label>
        <textarea class="form-control form-control-sm" id="answer-body" name="answer-body" required></textarea>
        <div class="invalid-feedback">Merci d'écrire ici votre réponse ou commentaire.</div>
    </div>
    <div class="preview d-none">
        <div class="preview-title">Prévisualisation</div>
        <div class="preview-body">
            <p class="preview-text"></p>
        </div>
    </div>
    <button type="submit" class="send-button">Envoyer</button>
</form>

<div class="toast form-toast success" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="d-flex">
        <div class="toast-body">La réponse a été envoyée!</div>
        <button type="button" data-bs-dismiss="toast" aria-label="Fermer"></button>
    </div>
</div>

<div class="toast form-toast error" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="d-flex">
        <div class="toast-body">Erreur, la réponse n'a pas été envoyée...</div>
        <button type="button" data-bs-dismiss="toast"" aria-label="Fermer"></button>
    </div>
</div>
`;

const questionViewTemplate = (question, answerForm) => `
<div class="question-view">

    <div class="question-header">
        <div class="question-title-date">
            <h5 class="question-title">${question.title}</h5>
            <div class="question-date">${question.date}</div>
        </div>
        <div class="question-icons">
            ${question.resolved ? `<div class="question-resolved" title="Question résolue"></div>` : ''}
            <div class="question-likes ${question.user_liked ? 'liked' : ''}">${question.likes}</div>
        </div>
    </div>
    <div class="question-body">${question.body}</div>
    <div class="question-image-wrapper">
        ${question.image}
    </div>
    
    <h6>${question.answers.length > 1 ? `${question.answers.length} réponses` : `${question.answers.length} réponse`}</h6>
    <div class="answers">
    </div>
    
    ${answerForm ? answerFormTemplate() : ''}
    
</div>
`;

const questionModalTemplate = (questionId) => `
<div class="modal question-modal" id="question-modal" data-bs-backdrop="false" data-bs-keyboard="false" tabindex="-1"
     aria-labelledby="modal-title" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
            <div class="modal-header">
                <a class="back-button" href="#" data-bs-dismiss="modal" aria-label="Retour"></a>
                <h1 class="modal-title-h1" id="modal-title">Question #${questionId}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
            </div>
            <div class="modal-body">
                <div class="content-wrapper">
                </div>
            </div>
        </div>
    </div>
</div>
`;

export {questionViewTemplate, questionModalTemplate, questionAnswersTemplate};