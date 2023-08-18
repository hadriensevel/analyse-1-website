// ----------------------------------
// ANIMATIONS
// ----------------------------------

// Helper function for toggling multiple elements
function toggleElements(elements, action) {
  elements.forEach(el => el.classList[action]('d-none'));
}

// Event handler
function handleButton(e, player, elements, play) {
  e.preventDefault();

  toggleElements(elements.hide, 'add');
  toggleElements(elements.show, 'remove');
  play ? player.play() : player.pause();

  player.once(play ? 'playing' : 'pause', () => {
    toggleElements(elements.swap, 'toggle');
  });
}

// Main animation function
function animations() {
  const containers = document.querySelectorAll('.animation-container');

  containers.forEach((container) => {
    // Elements
    const video = container.querySelector('.anim-video-plyr');
    const videoWrapper = video.parentElement;
    const divWrapper = container.querySelector('.div-container');
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
      swap: [divWrapper, videoWrapper]
    };

    const pauseElements = {
      hide: [pauseButton, fullscreenButton],
      show: [playButton],
      swap: [divWrapper, videoWrapper]
    };

    // Event listeners using event delegation
    container.addEventListener('click', (e) => {
      if (e.target === playButton) {
        handleButton(e, player, playElements, true);
      } else if (e.target === pauseButton) {
        handleButton(e, player, pauseElements, false);
      } else if (e.target === fullscreenButton) {
        e.preventDefault();
        player.fullscreen.toggle();
      }
    });
  });
}

export {animations};
