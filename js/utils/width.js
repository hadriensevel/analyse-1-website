// ----------------------------------
// PAGE WIDTH UTILS
// ----------------------------------

const increment = 150;

// Cookie utility
const cookieUtils = {
  set: (name, value, days) => {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/;SameSite=Strict`;
  },
  get: (name) => {
    const match = document.cookie.match(new RegExp(`(?<=${name}=).*?(?=;|$)`));
    return match ? match[0] : '';
  },
  exists: (name) => {
    return cookieUtils.get(name) !== '';
  }
};

// Change width of the page with buttons
function changeWidth(a) {
  const bodyWidth = parseInt(getComputedStyle(document.body).maxWidth);
  let newWidth = bodyWidth + a * increment;
  if (newWidth < 800) newWidth = 800;
  if (newWidth > window.innerWidth) newWidth = window.innerWidth;
  setWidth(newWidth);
  cookieUtils.set('width', newWidth, 200);
}

// Set width of the page
function setWidth(width) {
  const bodyWidth = document.querySelector('body').style;
  const headerWidth = document.querySelector('.had-navbar').style;
  bodyWidth.setProperty('max-width', width + 'px');
  headerWidth.setProperty('max-width', width + 'px');
}

// Main width function
function initWidth() {
  const widthPlus = document.getElementById('width-plus');
  const widthMinus = document.getElementById('width-minus');
  widthPlus.addEventListener('click', () => changeWidth(1));
  widthMinus.addEventListener('click', () => changeWidth(-1));
  if (cookieUtils.exists('width')) {
    const newWidth = cookieUtils.get('width');
    setWidth(newWidth);
  }
}

export {initWidth};