// ----------------------------------
// QUESTION CARD MODAL
// ----------------------------------

const questionCardTemplate = (question) => {
  return `
<div class="question-card" data-question-id="${question.id}">
    <div class="question-body">
        <div class="question-header">
            ${question.section_name ? `<div class="question-section-name">${question.section_name}</div>`: ''}
            <div class="question-preview">${question.preview}</div>
        </div>
        <div class="question-footer">
            <div class="question-author-date">
                <span class="question-id">#${question.id}</span>
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

const notAuthenticatedMessageTemplate = (baseUrl) => `
<div class="no-question container-md h-100">
  <div class="row h-100">
    <div class="d-flex flex-column flex-md-row align-items-center justify-content-center h-100">
      <img src="${baseUrl}/api/image/not-authenticated.png" class="mb-2 mb-md-0 mr-md-2 img-fluid" width="300" alt="Pas connecté">
      <p class="text-secondary text-center text-md-start">Merci de vous connecter pour pouvoir accéder à vos questions.</p>
    </div>
  </div>
</div>
`;

const errorMessageTemplate = (supportEmail) => `
<div class="error-message">
  <h6>Oups...</h6>
  <p>Une erreur est survenue lors du chargement des questions :(</p>
  <p>Si le problème persiste, n'hésitez pas à nous contacter ici: <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
</div>
`;

const paginationTemplate = (page, pagesCount) => {
    let pages = [];
    const maxDisplay = 5;

    if (pagesCount <= maxDisplay) {
        // If the total number of pages is less than or equal to maxDisplay, show all pages
        pages = Array.from({length: pagesCount}, (_, i) => i + 1);
    } else {
        // Calculate the first and last page to display
        let startPage = Math.max(page - 2, 1);
        let endPage = Math.min(startPage + maxDisplay - 1, pagesCount);

        // Adjust if we're at the last few pages
        if (page > pagesCount - 2) {
            startPage = pagesCount - 4;
            endPage = pagesCount;
        }

        // Generate the range of pages
        pages = Array.from({length: (endPage - startPage + 1)}, (_, i) => startPage + i);
    }

    return `
<ul class="pagination">
    <li class="page-item first-page-button ${page === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" aria-label="Première page">
        <span aria-hidden="true">&lt;&lt;</span>
      </a>
    </li>
    <li class="page-item previous-button ${page === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" aria-label="Précédent">
        <span aria-hidden="true">&lt;</span>
      </a>
    </li>
    ${pages.map(pageNumber => `
    <li class="page-item page-button ${pageNumber === page ? 'active' : ''}" data-page="${pageNumber}">
        <a class="page-link" href="#">${pageNumber}</a>
    </li>
    `).join('')}
    <li class="page-item next-button ${page === pagesCount || pagesCount === 0 ? 'disabled' : ''}">
      <a class="page-link" href="#" aria-label="Suivant">
        <span aria-hidden="true">&gt;</span>
      </a>
    </li>
    <li class="page-item last-page-button ${page === pagesCount || pagesCount === 0 ? 'disabled' : ''}">
      <a class="page-link" href="#" aria-label="Dernière page">
        <span aria-hidden="true">&gt;&gt;</span>
      </a>
    </li>
</ul>
`};

export {questionCardTemplate, noQuestionsMessageTemplate, notAuthenticatedMessageTemplate, errorMessageTemplate, paginationTemplate};