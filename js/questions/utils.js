// ----------------------------------
// QUESTIONS UTILS
// ----------------------------------

// Get the file name of the HTML page
function getFileName() {
  const path = window.location.pathname;
  return path.split('/').pop().replace('.html', '');
}

// Enum for the sorting of the questions
const Sort = {
  DATE: 'date',
  LIKES: 'likes',
  RESOLVED: 'resolved',
  NON_RESOLVED: 'non-resolved',
  NO_ANSWER: 'no-answer',
}

// Enum for the location of the question
// (question in the course or in an exercise)
const QuestionLocation = {
  COURSE: 'course',
  EXERCISE: 'exercise',
}

// Enum for the user role
const UserRole = {
  STUDENT: 'student',
  ASSISTANT: 'assistant',
  TEACHER: 'teacher',
}

// Escape HTML and keep the newlines
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function processLineBreaks(content) {
  // Regular expression to match both inline and block LaTeX content
  const regex = /\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g;

  let lastIndex = 0;
  const processedParts = [];

  // Find LaTeX chunks
  let match;
  while ((match = regex.exec(content)) !== null) {
    // Add plain text before the LaTeX chunk (if any) after converting line breaks
    if (match.index > lastIndex) {
      const plainText = content.slice(lastIndex, match.index).replace(/\n/g, '<br>');
      processedParts.push(plainText);
    }

    // Add the LaTeX chunk without converting line breaks
    processedParts.push(match[0]);

    lastIndex = regex.lastIndex;
  }

  // Add any remaining plain text after the last LaTeX chunk
  if (lastIndex < content.length) {
    const plainText = content.slice(lastIndex).replace(/\n/g, '<br>');
    processedParts.push(plainText);
  }

  return processedParts.join('');
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
    previewBodyText.innerHTML = processLineBreaks(escapeHTML(textarea.value));
    renderMathInElement(previewBodyText);
  }
}

export {getFileName, Sort, QuestionLocation, UserRole, escapeHTML, processLineBreaks, updatePreview};
