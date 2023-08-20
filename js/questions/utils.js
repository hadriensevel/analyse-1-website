// ----------------------------------
// QUESTIONS UTILS
// ----------------------------------

// Get the file name of the HTML page
function getFileName() {
  const path = window.location.pathname;
  return path.split('/').pop();
}

export {getFileName};
