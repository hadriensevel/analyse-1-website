// ----------------------------------
// QUESTION CARDS WRAPPER
// ----------------------------------

const questionCardsWrapperTemplate = (directView) => `
<div class="question-cards-wrapper" data-direct-view="${directView}">
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

export {questionCardsWrapperTemplate};
