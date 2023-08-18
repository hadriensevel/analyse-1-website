// ----------------------------------
// TABS UTILS
// ----------------------------------

function tabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabDivs = document.querySelectorAll('.tab-div');
  let activeTabButton = document.querySelector('.tab-button.active');

  tabButtons.forEach((tabButton) => {
    tabButton.addEventListener('click', (e) => {
      e.preventDefault();

      // Remove the active class from the previously active button
      activeTabButton.classList.remove('active');

      // Add the active class to the clicked button
      tabButton.classList.add('active');

      // Update the reference to the active tab button
      activeTabButton = tabButton;

      // Get the target tab ID from the data attribute
      const tabId = tabButton.dataset.target;

      // Show the target tab and hide others
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