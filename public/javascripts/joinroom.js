function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}

function joinRoom(name) {
  name = name || guid();
  var reg = /^[a-zA-Z0-9]+$/;
  if (reg.test(name)) {
    window.location = '/room/' + name;
  }
  else {
    console.error('Invalid characters used');
  }
}

var namedForm = document.getElementById('joinNamed');
var btnRandom = document.getElementById('joinRandom');

namedForm.addEventListener('submit', function(e) {
  e.preventDefault();
  joinRoom(document.getElementById('roomName').value);
});

btnRandom.addEventListener('click', function() {
  joinRoom();
});