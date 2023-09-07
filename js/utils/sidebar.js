// ----------------------------------
// SIDEBAR UTILS
// ----------------------------------

// Click event handler
const dropdownClickHandler = (wrapper) => {
  const currentShownDropdowns = wrapper.querySelectorAll('.had-nav-secondlevel.show:not(.current-dropdown)');
  currentShownDropdowns.forEach(currentShownDropdown => {
    new bootstrap.Collapse(currentShownDropdown).hide();
  });
}

// Prevent multiple dropdowns from being open at the same time
function sidebar(wrapper = document) {
  const dropdownButtons = wrapper.querySelectorAll('.had-nav-toplevel > a');
  dropdownButtons.forEach(dropdown => {
    dropdown.addEventListener('click', dropdownClickHandler.bind(dropdown, wrapper));
  });
}

export {sidebar};
