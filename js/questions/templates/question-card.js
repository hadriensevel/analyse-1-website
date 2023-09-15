// ----------------------------------
// QUESTION CARD MODAL
// ----------------------------------

const questionCardTemplate = (question) => {
  return `
<div class="question-card" data-question-id="${question.id}">
    <div class="question-body">
        <div class="question-header">
            <!--<h5 class="question-title">${question.title}</h5>-->
            <div class="question-preview">${question.preview}</div>
        </div>
        <div class="question-footer">
            <div class="question-author-date">
                <!--<p class="question-author"></p>-->
                <p class="question-date">${question.user_is_author ? 'vous, ' : ''}${question.relativeDate}</p>
            </div>
            <div class="question-comments-likes">
                <div class="question-resolved-locked">
                    ${question.resolved ? `<div class="question-resolved"></div>` : ''}
                    ${question.locked ? `<div class="question-locked"></div>` : ''}
                </div>
                <div class="question-comments">${question.answers}</div>
                <div class="question-likes">${question.likes}</div>
            </div>
        </div>
    </div>
</div>
`};

const noQuestionsMessageTemplate = (baseUrl) => `
<div class="no-question container-md h-100">
  <div class="row h-100">
    <div class="d-flex flex-column flex-md-row align-items-center justify-content-center h-100">
      <img src="${baseUrl}/api/image/no-question.png" class="mb-2 mb-md-0 mr-md-2 img-fluid" width="300" alt="Pas de question">
      <p class="text-secondary text-center text-md-start">Il n'y a pas encore de question ici. N'hésitez pas à en poser une!</p>
    </div>
  </div>
</div>
`;

const errorMessageTemplate = (supportEmail) => `
<div class="error-message">
  <h6>Oups...</h6>
  <p>Une erreur est survenue lors du chargement des questions :(</p>
  <p>Si le problème persiste, n'hésitez pas à nous contacter ici: <a href="mailto:${supportEmail}?subject=Erreur lors du chargement des questions (${pageId}${divId ? `, ${divId}` : ''})">${supportEmail}</a>.</p>
</div>
`;

export {questionCardTemplate, noQuestionsMessageTemplate, errorMessageTemplate};