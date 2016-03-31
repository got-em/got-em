var socket = io();
var horn = new Audio('/sounds/horn.mp3');
socket.on('sounds:horn', function() {
  horn.play();
});
