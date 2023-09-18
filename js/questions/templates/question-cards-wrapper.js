// ----------------------------------
// QUESTION CARDS WRAPPER
// ----------------------------------

const questionCardsTopBarTemplate = (Sort) => `
<div class="top-bar">
    <div>
        Trier par:
        <button class="sort-dropdown" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Date
        </button>
        <ul class="dropdown-menu">
            <li><a class="dropdown-item" data-sort="${Sort.DATE}" href="#">Date</a></li>
            <li><a class="dropdown-item" data-sort="${Sort.LIKES}" href="#">Likes</a></li>
            <li><a class="dropdown-item" data-sort="${Sort.RESOLVED}" href="#">Résolues</a></li>
            <li><a class="dropdown-item" data-sort="${Sort.NON_RESOLVED}" href="#">Non résolues</a></li>
            <li><a class="dropdown-item" data-sort="${Sort.ANSWERS}" href="#">Le plus de réponses</a></li>
            <li><a class="dropdown-item" data-sort="${Sort.NO_ANSWER}" href="#">Sans réponse</a></li>
        </ul>
        <a class="refresh-button" href="#" aria-label="Recharger les questions" title="Recharger les questions"></a>
    </div>
    <div class="new-question"></div>
</div>
`;

const newQuestionButtonTemplate = () => `
<button type="button" class="new-question-button">Nouvelle question</button>
`;

const questionCardsPlaceholderTemplate = () => `
<div>
    <div class="question-card-placeholder mt-2">
        <h5 class="placeholder-glow">
            <span class="placeholder col-8"></span>
        </h5>
        <div class="placeholder-glow">
            <span class="placeholder col-2"></span>
            <span class="placeholder col-4"></span>
        </div>
    </div>
    <div class="question-card-placeholder mt-4">
        <h5 class="placeholder-glow">
            <span class="placeholder col-5"></span>
        </h5>
        <div class="placeholder-glow">
            <span class="placeholder col-3"></span>
            <span class="placeholder col-5"></span>
        </div>
    </div>
</div>
`;

const questionCardsWrapperTemplate = (directView) => `
<div class="question-cards-wrapper" data-direct-view="${directView}">
</div>
`;

export {questionCardsTopBarTemplate, newQuestionButtonTemplate, questionCardsPlaceholderTemplate, questionCardsWrapperTemplate};
