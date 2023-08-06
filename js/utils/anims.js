// ----------------------------------
// ANIMATIONS
// ----------------------------------

function animations() {
  // Get the animation containers
  const containers = document.querySelectorAll('.animation-container');

  containers.forEach((container) => {
    // Getting the elements
    const video = container.querySelector('.anim-video-plyr');
    const videoWrapper = video.parentElement;
    const imgWrapper = container.querySelector('img').parentElement;
    const playButton = container.querySelector('.play-button');
    const pauseButton = container.querySelector('.pause-button');
    const fullscreenButton = container.querySelector('.fullscreen-button');

    // Initialize Plyr video player
    const player = new Plyr(video, {
      controls: ['progress'],
      clickToPlay: false,
      tooltips: {controls: false, seek: false}
    });

    // Initial state
    videoWrapper.classList.add('d-none');
    pauseButton.classList.add('d-none');
    fullscreenButton.classList.add('d-none');

    // Play button event
    playButton.addEventListener('click', function(e) {
      e.preventDefault();
      playButton.classList.add('d-none');
      pauseButton.classList.remove('d-none');
      fullscreenButton.classList.remove('d-none');
      player.play();

      player.once('playing', () => {
        imgWrapper.classList.add('d-none');
        videoWrapper.classList.remove('d-none');
      })
    });

    // Pause button event
    pauseButton.addEventListener('click', function(e) {
      e.preventDefault();
      imgWrapper.classList.remove('d-none');
      videoWrapper.classList.add('d-none');
      player.pause();
      playButton.classList.remove('d-none');
      pauseButton.classList.add('d-none');
      fullscreenButton.classList.add('d-none');
    });

    // Fullscreen button event
    fullscreenButton.addEventListener('click', function(e) {
      e.preventDefault();
      player.fullscreen.toggle();
    });
  });
}

export {animations};
