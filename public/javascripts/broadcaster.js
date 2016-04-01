var socket = io();
var sounds = {};

socket.on('load', function(soundList) {
  // Build sound dictionary (String -> Audio)
  sounds = soundList.reduce(function(sounds, sound) {
    sounds[sound] = new Audio('/sounds/' + sound + '.mp3');
    return sounds;
  }, sounds);
});

socket.on('play', function(sound) {
  if (!sounds[sound]) return console.error('Missing sound: ' + sound);
  sounds[sound].play();
});
