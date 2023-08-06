// ----------------------------------
// TABS UTILS
// ----------------------------------

function tabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabDivs = document.querySelectorAll('.tab-div');

  tabButtons.forEach((tabButton) => {
    tabButton.addEventListener('click', () => {
      document.querySelector('.tab-button.active').classList.remove('active');
      tabButton.classList.add('active');
      tabDivs.forEach((tabDiv) => {
        if (tabDiv.id === tabButton.dataset.target) {
          tabDiv.classList.remove('d-none');
        } else {
          tabDiv.classList.add('d-none');
        }
      });
    });
  });
}

export {tabs};