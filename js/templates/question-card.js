// ----------------------------------
// QUESTION CARD MODAL
// ----------------------------------

const questionCardTemplate = (questionId, questionTitle, questionResolved, questionAuthor, questionDate, questionComments, questionLikes) => {
  if (questionComments) {
    questionComments = `<div class="question-comments">${questionComments}</div>`;
  } else {
    questionComments = '';
  }

  if (questionLikes) {
    questionLikes = `<div class="question-likes">${questionLikes}</div>`;
  } else {
    questionLikes = '';
  }

  if (questionResolved) {
    questionResolved = `<div class="resolved-question"></div>`;
  } else {
    questionResolved = '';
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
`
};
export {questionCardTemplate};