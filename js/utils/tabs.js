// ----------------------------------
// TABS UTILS
// ----------------------------------

function tabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabDivs = document.querySelectorAll('.tab-div');

  tabButtons.forEach((tabButton) => {
    tabButton.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('.tab-button.active').classList.remove('active');
      tabButton.classList.add('active');
      const tabId = new URL(tabButton.href).hash.slice(1);
      tabDivs.forEach((tabDiv) => {
        if (tabDiv.id === tabId) {
          tabDiv.classList.remove('d-none');
        } else {
          tabDiv.classList.add('d-none');
        }
      });
    });
  });
}

export {tabs};