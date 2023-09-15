// ----------------------------------
// QUESTION VIEW
// ----------------------------------

const polycopDivViewTemplate = () => `
<div class="polycop-div-view">
    <a class="div-view-button" data-bs-toggle="collapse" href="#div-view"
       role="button" aria-expanded="false" aria-controls="div-view">
        Afficher la section du cours
    </a>
    <div class="collapse" id="div-view"></div>
</div>
`;

const questionAnswersTemplate = (answer) => `
<div class="answer" data-answer-id="${answer.id}" data-body="${answer.body}">
    <div class="answer-body">${answer.formatted_body}</div>
    <div class="answer-footer">
        <span class="answer-accepted" data-accepted="${answer.accepted ? 'true' : 'false'}" title="Réponse acceptée"></span>
        ${answer.user_role}
        <span class="answer-date">${answer.user_is_author ? 'vous, ' : ''}${answer.date}</span>
        ${(answer.can_edit || answer.can_delete || answer.can_accept) ? `
        <div class="answer-options" data-bs-toggle="dropdown"></div>
        <ul class="dropdown-menu">
            ${answer.can_edit ? `<li><a class="dropdown-item" data-action="edit" href="#">Éditer</a></li>` : ''}
            ${answer.can_accept ? `<li><a class="dropdown-item" data-action="accept" href="#">${answer.accepted ? 'Invalider la réponse' : 'Valider la réponse'}</a></li>` : ''}
            ${answer.can_delete ? `<li><a class="dropdown-item" data-action="delete" href="#">Supprimer</a></li>` : ''}
        </ul>
        ` : ''}
    </div>
</div>
`;

const answerEditFormTemplate = (answerBody) => `
<form novalidate class="edit-form">
    <div class="my-3">
        <label for="answer-body" class="form-label">Éditer la réponse</label>
        <textarea class="form-control form-control-sm" id="answer-body" name="answer-body" rows="5" required>${answerBody}</textarea>
        <div class="invalid-feedback">La réponse ne peut pas être vide.</div>
    </div>
    <div class="preview d-none">
        <div class="preview-title">Prévisualisation</div>
        <div class="preview-body">
            <p class="preview-text"></p>
        </div>
    </div>
    <button class="cancel-button">Annuler</button>
    <button type="submit" class="save-button">Enregistrer</button>
</form>
`;

const questionEditFormTemplate = (questionBody) => `
<form novalidate class="edit-form">
    <div class="my-3">
        <textarea class="form-control form-control-sm" id="question-body" name="question-body" rows="5" required>${questionBody}</textarea>
        <div class="invalid-feedback">La question ne peut pas être vide.</div>
    </div>
    <!--<div class="mb-3">
        <label for="image" class="form-label">Ajouter une image (optionnel, max 5 Mo)</label>
        <input class="form-control form-control-sm" type="file" id="image" name="image" accept="image/*">
        <div class="invalid-feedback"></div>
    </div>-->
    <div class="preview d-none">
        <div class="preview-title">Prévisualisation</div>
        <div class="preview-body">
            <p class="preview-text"></p>
        </div>
    </div>
    <button class="cancel-button">Annuler</button>
    <button type="submit" class="save-button">Enregistrer</button>
</form>
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
            <!--<h5 class="question-title">${question.title}</h5>-->
            <div class="question-date">${question.user_is_author ? 'vous, ' : ''}${question.date}</div>
        </div>
        <div class="question-icons">
            ${question.resolved ? `<div class="question-resolved" title="Question résolue"></div>` : ''}
            ${question.locked ? `<div class="question-locked" title="Question verrouillée"></div>` : ''}
            <div class="question-likes ${question.user_liked ? 'liked' : ''}">${question.likes}</div>
            ${question.can_edit || question.can_delete || question.can_lock ? `
            <div class="question-options">
                <div class="question-options-button" data-bs-toggle="dropdown"></div>
                <ul class="dropdown-menu">
                    ${question.can_edit ? '<li><a class="dropdown-item" data-action="edit" href="#">Éditer</a></li>' : ''}
                    ${question.can_lock ? `<li><a class="dropdown-item disabled" data-action="lock" href="#">${question.locked ? 'Déverrouiller' : 'Vérrouiller'}</a></li>` : ''}
                    ${question.can_delete ? '<li><a class="dropdown-item text-danger" data-action="delete" href="#">Supprimer</a></li>' : ''}
                </ul>
            </div>` : ''}
        </div>
    </div>
    <div class="question-body" data-body="${question.body}">${question.formatted_body}</div>
    <div class="question-image-wrapper">
        ${question.image}
    </div>
    
    <h6><span class="count-answers">${question.answers.length}</span> ${question.answers.length > 1 ? 'réponses' : 'réponse'}</h6>
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

export {polycopDivViewTemplate, questionViewTemplate, questionModalTemplate, questionAnswersTemplate, questionEditFormTemplate, answerEditFormTemplate};