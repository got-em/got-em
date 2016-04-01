var socket = io();

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

socket.on('load', function(sounds) {
  sounds.forEach(registerOnClick);
});
