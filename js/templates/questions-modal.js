// ----------------------------------
// QUESTIONS MODAL
// ----------------------------------

const questionModalTemplate = (modalId) => `
<div class="modal questions-modal" id="${modalId}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
     aria-labelledby="modal-title" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="questions-modal-title" id="modal-title">Questions <span class="questions-modal-title-badge">0</span></h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
            
                <div class="question-card" id="1">
                    <div class="question-body">
                        <div class="question-header">
                            <h5 class="question-title">Titre de la question</h5>
                            <div class="resolved-question"></div>
                        </div>
                        <div class="question-footer">
                            <div class="question-author-date">
                                <p class="question-author">Anonyme</p>
                                <p class="question-date">4j</p>
                            </div>
                            <div class="question-comments-likes">
                                <div class="question-comments">3</div>
                                <div class="question-likes">12</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="question-card" id="2">
                    <div class="question-body">
                        <div class="question-header">
                            <h5 class="question-title">Titre de la question</h5>
                        </div>
                        <div class="question-footer">
                            <div class="question-author-date">
                                <p class="question-author">Anonyme</p>
                                <p class="question-date">6j</p>
                            </div>
                            <div class="question-comments-likes">
                                <div class="question-likes">1</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="question-card" id="3">
                    <div class="question-body">
                        <div class="question-header">
                            <h5 class="question-title">Titre de la question</h5>
                            <div class="resolved-question"></div>
                        </div>
                        <div class="question-footer">
                            <div class="question-author-date">
                                <p class="question-author">Anonyme</p>
                                <p class="question-date">1m</p>
                            </div>
                            <div class="question-comments-likes">
                                <div class="question-comments">7</div>
                                <div class="question-likes">28</div>
                            </div>
                        </div>
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
                <p class="question-author">${questionAuthor}</p>
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