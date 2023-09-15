// ----------------------------------
// LATEX PREVIEW COMPONENT
// ----------------------------------

import {createElementFromTemplate} from '../questions/templates/utils';

const latexPreviewTemplate = `
<div class="latex-preview">
    <form class="latex-preview-form">
        <div class="mb-3">
            <label for="question-body" class="form-label">Prévisualisation \(\LaTeX\)</label>
            <textarea class="form-control form-control-sm" id="question-body" name="question-body" rows="5"></textarea>
            <div class="invalid-feedback">Merci d'écrire ici votre question.</div>
        </div>
        <div class="preview d-none">
            <div class="preview-title">Prévisualisation</div>
            <div class="preview-body">
                <p class="preview-text"></p>
            </div>
        </div>
    </form>
</div>
`;