import React from 'react';
import {render} from 'react-dom';
import Button from './button.jsx';
import Soundboard from './soundboard.jsx';
import Chat from './chat.jsx';

const socket = io();
const room = window.location.pathname.split('/').pop();
const url = window.location.href;
let sounds = {};
let voicesLoaded = false;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sounds: [],
      filter: '',
      message: '',
      voices: [],
      selectedVoice: '',
      logs: [],
      mute: false
    };
    this.setFilter = this.setFilter.bind(this);
    this.playSound = this.playSound.bind(this);
    this.speech = this.speech.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.setMute = this.setMute.bind(this);
    this.notify = this.notify.bind(this);
    this.setVoice = this.setVoice.bind(this);

    socket.emit('joinroom', room);

    socket.on('reconnect', () => {
      socket.emit('joinroom', room);
    });

    socket.on('notification', (msg) => {
      this.notify(msg);
    });

    socket.on('load', (soundList) => {
      this.setState({ sounds: soundList }, () => {
        sounds = soundList.reduce((sounds, sound) => {
          sounds[sound.name] = {};
          sounds[sound.name].el = document.querySelectorAll('[data-sound="' + sound.name  + '"]')[0];
          sounds[sound.name].name = sound.name;
          return sounds;
        }, sounds);
      });
    });

    socket.on('play', (sound, directory) => {
      if (!sounds[sound]) return console.error('Missing sound: ' + sound);

      if (!sounds[sound]['file']) sounds[sound]['file'] = new Audio('/sounds/' + directory + '/' + sound + '.mp3');

      sounds[sound].file.play();
      sounds[sound].el.classList.add('shake');
      setTimeout(() => {
        sounds[sound].el.classList.remove('shake');
      }, 500);
    });

    socket.on('speech', (data) => {
      const msg = data.message;
      const msgVoice = data.voice;
      const textarea = document.getElementById('speech-log');
      let logs = this.state.logs;

      if (!msg.length) return;

      if (!this.state.mute) {
        let utterance = new SpeechSynthesisUtterance(msg);
        utterance.voice = speechSynthesis
                            .getVoices()
                            .filter((voice) => {
                              return voice.name === msgVoice;
                            })[0];
        window.speechSynthesis.speak(utterance);
      }

      logs.push('(' + msgVoice + ' ' + new Date().toLocaleTimeString() + ') ' + msg + '\n');
      this.setState({ logs: logs });
      textarea.scrollTop = textarea.scrollHeight;
    });

  }

  componentDidMount() {
    window.speechSynthesis.onvoiceschanged = () => {
      if (voicesLoaded) return;

      voicesLoaded = true;
      let voices = [];
      window.speechSynthesis.getVoices().forEach((voice) => {
        voices.push(voice.name);
      });
      this.setState({ voices: voices, selectedVoice: voices[0] });
    };
  }

  setFilter(e) {
    this.setState({ filter: e.target.value });
  }

  setMessage(e) {
    this.setState({ message: e.target.value });
  }

  setMute(e) {
    this.setState({ mute: e.target.checked });
  }

  setVoice(e) {
    this.setState({ selectedVoice: e.target.value });
  }

  playSound(sound) {
    var request = new XMLHttpRequest();
    request.open('GET', '/sounds/' + sound + '?room=' + room, true);
    request.onerror = () => {
      alert('Could not reach server!');
    };
    request.send();
  }

  speech (e) {
    this.setState({ message: '' });
    e.preventDefault();
    const request = new XMLHttpRequest();
    request.open('POST', '/speech?room=' + room, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({ message: this.state.message, voice: this.state.selectedVoice }));
  };

  notify(msg) {
    const notificationManager = document.getElementById('notification-manager');
    const toast = document.createElement('div');
    const toastMsg = document.createTextNode(msg);
    toast.className='toast';
    toast.appendChild(toastMsg);
    notificationManager.appendChild(toast);
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        toast.classList.toggle('toast--active');
        setTimeout(() => {
          toast.classList.toggle('toast--active');
          resolve();
        }, 1000);
      }, 1000);
    });
    promise.then(() => {
      setTimeout(() => {
        notificationManager.removeChild(toast);
      }, 300);
    });
  }

  render() {
    return (
      <div>
        <div className="text-center">
          <h3>Have others join this room by sharing your room location</h3>
          <p>Your room URL is <a href={url}>{url}</a></p>
        </div>
        <Soundboard filter={this.state.filter} setFilter={this.setFilter} sounds={this.state.sounds} playSound={this.playSound} />
        <Chat setVoice={this.setVoice} setMessage={this.setMessage} message={this.state.message} voices={this.state.voices} speech={this.speech} setMute={this.setMute} logs={this.state.logs} />
      </div>
    )
  }
}

render(<App />, document.getElementById("app"));