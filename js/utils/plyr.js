// ----------------------------------
// PLYR VIDEO PLAYER
// ----------------------------------

// Initialize Plyr video player
function plyrInit() {
  const controls = [
    "play",
    "progress",
    "current-time",
    "mute",
    "volume",
    "settings",
    "fullscreen",
  ];
  const speed = {
    selected: 1,
    options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2 , 5],
  };
  const i18n = {
    play: 'Lire',
    pause: 'Pause',
    mute: 'Désactiver le son',
    unmute: 'Activer le son',
    enterFullscreen: 'Plein écran',
    exitFullscreen: 'Quitter le plein écran',
    settings: 'Paramètres',
    speed: 'Vitesse',
    normal: 'Normale',
  };
  const tooltips = {
    controls: true,
    seek: true,
  };
  try {
    const players = Plyr.setup(".video-plyr", {controls, speed, i18n, tooltips});
    const audioPlayers = Plyr.setup(".audio-player", {speed, i18n, tooltips});
  } catch {}
}

export {plyrInit};