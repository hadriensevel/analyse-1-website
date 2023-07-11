// ----------------------------------
// PAGE WIDTH UTILS
// ----------------------------------

// Change width of the page with buttons
function changeWidth(a) {
  const bodyWidth = document.querySelector('body').style;
  const width = bodyWidth.maxWidth ? parseInt(bodyWidth.maxWidth) : 800;
  let newWidth = width + a * 250;
  if (newWidth < 800) newWidth = 800;
  if (newWidth > window.innerWidth) newWidth = window.innerWidth;
  setWidth(newWidth);
  setWidthCookie(newWidth);
}

// Set width of the page
function setWidth(width) {
  const bodyWidth = document.querySelector('body').style;
  bodyWidth.setProperty('max-width', width + 'px');
}

// Set cookie with width
function setWidthCookie(width) {
  const d = new Date();
  const numberOfDays = 200;
  d.setTime(d.getTime() + (numberOfDays * 24 * 60 * 60 * 1000));
  const expires = 'expires=' + d.toUTCString();
  document.cookie = 'width=' + width + ';' + expires + ';path=/';
}

// Get cookie with width
function getWidthCookie() {
  const name = 'width=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

// Check if cookie with width exists
function checkWidthCookie() {
  const width = getWidthCookie('width');
  return width !== '';
}

export {changeWidth, setWidth, getWidthCookie, checkWidthCookie};