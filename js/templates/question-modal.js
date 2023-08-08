// ----------------------------------
// QUESTION MODAL
// ----------------------------------

const questionModalTemplate = (modalId) => `
<div class="modal question-modal" id="${modalId}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
     aria-labelledby="modal-title" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="question-modal-title" id="modal-title">Questions <span class="question-modal-title-badge">0</span></h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
            </div>
            <div class="modal-body">
            
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
            <div class="modal-footer">
                <button type="button" class="new-question-button">Nouvelle question</button>
            </div>
        </div>
    </div>
</div>
`;

const questionCardTemplate = (questionId, questionTitle, questionResolved, questionAuthor, questionDate, questionComments, questionLikes) => {
  if (questionComments) {
    questionComments = `<div class="question-comments">${questionComments}</div>`;
  }
  if (questionLikes) {
    questionLikes = `<div class="question-likes">${questionLikes}</div>`;
  }
  if (questionResolved) {
    questionResolved = `<div class="resolved-question"></div>`;
  }
  return `
<div class="question-card" id="${questionId}">
    <div class="question-body">
        <div class="question-header">
            <h5 class="question-title">${questionTitle}</h5>
            ${questionResolved}
        </div>
        <div class="question-footer">
            <div class="question-author-date">
                <!--<p class="question-author">${questionAuthor}</p>-->
                <p class="question-date">${questionDate}</p>
            </div>
            <div class="question-comments-likes">
                ${questionComments}
                ${questionLikes}
            </div>
        </div>
    </div>
</div>
`};

export {questionModalTemplate, questionCardTemplate};