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
}

// Enum for the location of the question
// (question in the course or in an exercise)
const QuestionLocation = {
  COURSE: 'course',
  EXERCISE: 'exercise',
}

export {getFileName, Sort, QuestionLocation};
