// ----------------------------------
// SIDEBAR UTILS
// ----------------------------------

// Click event handler
const dropdownClickHandler = (dropdown) => {
  const currentShownDropdowns = document.querySelectorAll('.had-nav-secondlevel.show');
  const dropdownChild = dropdown.querySelector('.had-nav-secondlevel');

  currentShownDropdowns.forEach(currentShownDropdown => {
    if (currentShownDropdown !== dropdownChild) {
      new bootstrap.Collapse(currentShownDropdown).hide();
    }
  });
}

// Prevent multiple dropdowns from being open at the same time
function sidebar() {
  const dropdownButtons = document.querySelectorAll('.had-nav-toplevel > a');

  dropdownButtons.forEach(dropdown => {
    dropdown.addEventListener('click', () => dropdownClickHandler(dropdown));
  });
}

export {sidebar};
