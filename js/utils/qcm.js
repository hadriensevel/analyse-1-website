// ----------------------------------
// QCM UTILS
// ----------------------------------

function toggleClasses(element, ...classes) {
  classes.forEach((cls) => {
    element.classList.toggle(cls);
  });
}

// Handle QCM button to show the answers
function qcm() {
  const qcms = document.querySelectorAll('.qcm');
  qcms.forEach((qcm) => {
    const qcmButton = qcm.querySelector('.qcm-button');
    const qcmAnswers = qcm.querySelectorAll('.qcm-answer');

    qcmButton.addEventListener('click', () => {
      qcmAnswers.forEach((qcmAnswer) => {
        toggleClasses(qcmAnswer, qcmAnswer.dataset.answer === 'true' ? 'true' : 'false');
      });
    });
  });
}

export {qcm};