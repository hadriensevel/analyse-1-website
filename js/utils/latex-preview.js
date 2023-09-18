// ----------------------------------
// LATEX PREVIEW COMPONENT
// ----------------------------------

import {createElementFromTemplate} from '../questions/templates/utils';
import {updatePreview} from '../questions/utils';

const latexPreviewTemplate = `
<div class="latex-preview">
    <form class="latex-preview-form my-4">
        <div class="my-2">
            <label for="question-body" class="form-label fw-medium">Prévisualisation \\(\\LaTeX\\)</label>
            <textarea class="form-control form-control-sm" id="question-body" name="question-body" rows="5"></textarea>
        </div>
        <div class="preview d-none">
            <div class="preview-body border rounded-1 px-2 py-1">
                <p class="preview-text p-0"></p>
            </div>
        </div>
    </form>
</div>
`;

function latexPreview() {
  const previewScriptTag = document.body.querySelector('script[data-latex-preview]');
  if (!previewScriptTag) {
    return;
  }

  const previewDiv = createElementFromTemplate(latexPreviewTemplate);
  previewScriptTag.before(previewDiv);

  renderMathInElement(previewDiv);

  const previewForm = previewDiv.querySelector('.latex-preview-form');
  const previewTextarea = previewForm.querySelector('textarea');
  const preview = previewForm.querySelector('.preview');
  const previewText = preview.querySelector('.preview-text');

  previewTextarea.addEventListener('input', (e) => {
    e.preventDefault();

    updatePreview(previewTextarea, preview, previewForm, previewText);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  latexPreview();
});