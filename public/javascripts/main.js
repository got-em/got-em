var socket = io();
var sounds = {};
var muteEl = document.querySelectorAll('.mute')[0];

socket.on('load', function(soundList) {
  // Build sound dictionary (String -> Audio)
  sounds = soundList.reduce(function(sounds, sound) {
    sounds[sound] = new Audio('/sounds/' + sound + '.mp3');
    registerOnClick(sound);
    return sounds;
  }, sounds);
});

socket.on('play', function(sound) {
  if (!sounds[sound]) return console.error('Missing sound: ' + sound);

  if (muteEl.checked) return;

  sounds[sound].play();
});

function registerOnClick(sound) {
  // Grab button element
  var el = document.querySelectorAll('[data-sound="' + sound + '"]');

  // Register click handler
  if (el.length) {
    el[0].addEventListener('click', function() {
      var request = new XMLHttpRequest();
      request.open('GET', '/sounds/' + sound, true);
      request.onerror = function() {
        alert('Could not reach server!');
      };
      request.send();
    });
  }
}
