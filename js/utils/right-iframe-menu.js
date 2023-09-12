import axios from 'axios';
import {sidebar} from './sidebar';

async function fetchMenuItems() {
  const response = await axios.get('/analyse-1/');
  const parser = new DOMParser();
  return parser.parseFromString(response.data, 'text/html').querySelector('.had-sidebar-menu');
}

function createHamburgerButton() {
  const button = document.createElement('button');
  button.classList.add('hamburger-button', 'btn', 'btn-secondary', 'btn-sm', 'btn-floating', 'position-fixed', 'top-0', 'end-0', 'd-xl-block', 'd-none');
  button.style.marginTop = '4.5rem';
  button.style.marginRight = '4.5rem';
  button.setAttribute('type', 'button');
  button.setAttribute('data-bs-toggle', 'offcanvas');
  button.setAttribute('data-bs-target', '#right-iframe-menu');
  button.setAttribute('aria-controls', 'right-iframe-menu');
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-label', 'Menu');
  button.innerHTML = `<i class="bi bi-list"></i>`;
  return button;
}

function createMenuElement() {
  const menu = document.createElement('div');
  menu.classList.add('offcanvas', 'offcanvas-end', 'right-iframe-menu');
  menu.setAttribute('id', 'right-iframe-menu');
  menu.setAttribute('tabindex', '-1');
  menu.setAttribute('aria-labelledby', 'right-iframe-menu-label');
  menu.innerHTML = `
    <div class="offcanvas-header">
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Fermer"></button>
    </div>
    <div class="offcanvas-body">
    </div>
  `;
  return menu;
}

function setupLinkListeners(menu) {
  const iframe = document.querySelector('#right-iframe');

  menu.querySelectorAll('.had-nav-link-secondlevel > a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      iframe.setAttribute('src', `/analyse-1/${link.getAttribute('href')}`);

      // Close the menu
      const offcanvas = bootstrap.Offcanvas.getInstance(document.querySelector('#right-iframe-menu'));
      offcanvas.hide();
    });
  });

  menu.querySelectorAll('.had-pdf-link > a').forEach(link => {
    link.href = `/analyse-1/${link.getAttribute('href')}`;
  });
}

async function rightIframeMenu() {
  const hamburgerButton = createHamburgerButton();
  document.body.appendChild(hamburgerButton);

  const menu = createMenuElement();
  const polycopMenu = await fetchMenuItems();

  setupLinkListeners(polycopMenu);
  menu.querySelector('.offcanvas-body').appendChild(polycopMenu);
  sidebar(menu);
  document.body.appendChild(menu);
  renderMathInElement(menu);
}

export {rightIframeMenu};
