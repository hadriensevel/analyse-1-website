// ----------------------------------
// QUESTIONS UTILS
// ----------------------------------

// Get the file name of the HTML page
function getFileName() {
  const path = window.location.pathname;
  return path.split('/').pop();
}

// Enum for the sorting of the questions
const Sort = {
  DATE: 'date',
  LIKES: 'likes',
  RESOLVED: 'resolved',
}

// Enum for the location of the question
// (question in the course or in an exercise)
const QuestionLocation = {
  COURSE: 'course',
  EXERCISE: 'exercise',
}

// Escape HTML and keep the newlines
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

// Update the preview when the user types in the textarea
function updatePreview(textarea, preview, previewBody, previewBodyText) {
  // If the textarea is empty, hide the preview
  const isEmpty = !textarea.value;
  const hasImage = !!previewBody.querySelector('img');
  if (isEmpty) {
    previewBodyText.textContent = '';
    if (!hasImage) {
      preview.classList.add('d-none');
    }
  } else {
    preview.classList.remove('d-none');
    // Escape HTML and render LaTeX but take the newlines into account
    previewBodyText.innerHTML = escapeHTML(textarea.value);
    renderMathInElement(previewBodyText);
  }
}

export {getFileName, Sort, QuestionLocation, updatePreview};
