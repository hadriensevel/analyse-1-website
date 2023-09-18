// ----------------------------------
// SOLUTIONS OF THE EXERCISES
// ----------------------------------

import {getAuthData} from './auth';

function solutions() {
  const solutionElement = document.querySelector('#solution:not(.visible-etudiant)');

  if (solutionElement) {
    const user = getAuthData();
    if (!user || user.role === 'student') {
      solutionElement.innerHTML = '<p>La solution de l\'exercice n\'est pas encore disponible.</p>';
    }
  }
}

export {solutions};