// ----------------------------------
// QUESTION CARD MODAL
// ----------------------------------

const questionCardTemplate = (question) => {
  return `
<div class="question-card" data-question-id="${question.id}">
    <div class="question-body">
        <div class="question-header">
            <!--<h5 class="question-title">${question.title}</h5>-->
            <div class="question-preview">${question.formatted_preview}</div>
        </div>
        <div class="question-footer">
            <div class="question-author-date">
                <!--<p class="question-author"></p>-->
                <p class="question-date">${question.relativeDate}</p>
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
export {questionCardTemplate};