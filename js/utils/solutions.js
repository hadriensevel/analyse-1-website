// ----------------------------------
// SOLUTIONS OF THE EXERCISES
// ----------------------------------

import {validateToken} from './auth';

async function solutions() {
  const solutionElement = document.querySelector('#solution:not(.visible-etudiant)');

  if (solutionElement) {
    const user = await validateToken();
    if (!user || user === 401 || user === 'session_expired' || user.role === 'student') {
      solutionElement.innerHTML = '<p>La solution de l\'exercice n\'est pas encore disponible.</p>';
    }
  }
}

export {solutions};