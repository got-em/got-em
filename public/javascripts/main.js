var socket = io();
var sounds = {};
var muteEl = document.querySelectorAll('.mute')[0];
var speechEl = document.querySelectorAll('.input-speech')[0];
var selectEl = document.querySelectorAll('.select-voice')[0];
var speechLogEl = document.querySelectorAll('.textarea-speech-log')[0];
var voicesLoaded = false;
var room = window.location.pathname.split('/').pop();

// wait on voices to be loaded before fetching list (loaded async)
window.speechSynthesis.onvoiceschanged = function() {
  if (voicesLoaded) return;

  voicesLoaded = true;
  window.speechSynthesis.getVoices().forEach(function(voice) {
    var option = document.createElement("option");
    option.text = voice.name;
    option.value = voice.name;
    option.selected = voice.default;
    selectEl.appendChild(option);
  });
};

socket.emit('joinroom', room);

socket.on('notification', function(msg){
  var notificationManager = document.getElementById('notification-manager');
  var toast = document.createElement('div');
  toast.className='toast';
  var toastMsg = document.createTextNode(msg);
  toast.appendChild(toastMsg);
  notificationManager.appendChild(toast);
  var promise = new Promise(function(resolve, reject){
    setTimeout(function(){
      toast.classList.toggle('toast--active');
      setTimeout(function(){
        toast.classList.toggle('toast--active');
        resolve();
      }, 1000);
    }, 1000);
  });
  promise.then(function(){
    //wait an additional 300ms to account for the css transition
    setTimeout(function(){
      notificationManager.removeChild(toast);
    }, 300);
  });
});

socket.on('load', function(soundList) {
  // Build sound dictionary (String -> Audio)
  sounds = soundList.reduce(function(sounds, sound) {
    sounds[sound] = new Audio('/sounds/' + sound + '.mp3');
    registerOnClick(sound);
    return sounds;
  }, sounds);
});

socket.on('speech', function(data) {
  var msg = data.message;
  var msgVoice = data.voice;

  if (!msg.length) return;

  if (!muteEl.checked) {
    var utterance = new SpeechSynthesisUtterance(msg);
    utterance.voice = speechSynthesis
                        .getVoices()
                        .filter(function(voice) {
                          return voice.name === msgVoice;
                        })[0];
    window.speechSynthesis.speak(utterance);
  }

  speechLogEl.value = speechLogEl.value + '(' + msgVoice + ' ' + new Date().toLocaleTimeString() + ') ' + msg + '\n';
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
      request.open('GET', '/sounds/' + sound + '?room=' + room, true);
      request.onerror = function() {
        alert('Could not reach server!');
      };
      request.send();
    });
  }
}

var speech = function() {
  event.preventDefault();
  var msg = speechEl.value;
  speechEl.value = '';
  var request = new XMLHttpRequest();
  request.open('POST', '/speech?room=' + room, true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(JSON.stringify({ message: msg, voice: selectEl.value }));
};
