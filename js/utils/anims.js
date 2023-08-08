// ----------------------------------
// ANIMATIONS
// ----------------------------------

// Helper function for toggling multiple elements
function toggleElements(elements, action) {
  elements.forEach(el => el.classList[action]('d-none'));
}

// Event handlers
function handlePlayButton(e, player, elements) {
  e.preventDefault();

  toggleElements(elements.hide, 'add');
  toggleElements(elements.show, 'remove');
  player.play();

  player.once('playing', () => {
    toggleElements(elements.swap, 'toggle');
  });
}

function handlePauseButton(e, player, elements) {
  e.preventDefault();

  toggleElements(elements.swap, 'toggle');
  player.pause();

  toggleElements(elements.hide, 'add');
  toggleElements(elements.show, 'remove');
}

function handleFullscreenButton(e, player) {
  e.preventDefault();
  player.fullscreen.toggle();
}

// Main animation function
function animations() {
  const containers = document.querySelectorAll('.animation-container');

  containers.forEach((container) => {
    // Elements
    const video = container.querySelector('.anim-video-plyr');
    const videoWrapper = video.parentElement;
    const imgWrapper = container.querySelector('img').parentElement;
    const playButton = container.querySelector('.play-button');
    const pauseButton = container.querySelector('.pause-button');
    const fullscreenButton = container.querySelector('.fullscreen-button');

    // Plyr player
    const player = new Plyr(video, {
      controls: ['progress'],
      clickToPlay: false,
      tooltips: {controls: false, seek: false}
    });

    // Initial state
    toggleElements([videoWrapper, pauseButton, fullscreenButton], 'add');

    // Elements for button handlers
    const playElements = {
      hide: [playButton],
      show: [pauseButton, fullscreenButton],
      swap: [imgWrapper, videoWrapper]
    };

    const pauseElements = {
      hide: [pauseButton, fullscreenButton],
      show: [playButton],
      swap: [imgWrapper, videoWrapper]
    };

    // Event listeners
    playButton.addEventListener('click', e => handlePlayButton(e, player, playElements));
    pauseButton.addEventListener('click', e => handlePauseButton(e, player, pauseElements));
    fullscreenButton.addEventListener('click', e => handleFullscreenButton(e, player));
  });
}

export {animations};
