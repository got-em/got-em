import React from 'react';
import {render} from 'react-dom';
import Button from './button';
import Soundboard from './soundboard';
import Listeners from './listeners';
import Chat from './chat';
import Notify from '../lib/notification';
import * as tour from '../lib/tour';
import Request from '../lib/request';

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
      mute: false,
      listeners: 0
    };
    this.inputHandler = this.inputHandler.bind(this);
    this.playSound = this.playSound.bind(this);
    this.speech = this.speech.bind(this);

    socket.emit('joinroom', room);
    socket.on('listeners', listeners => this.setState({ listeners }));
    socket.on('reconnect', () => socket.emit('joinroom', room));
    socket.on('notification', msg => Notify(msg));
    socket.on('load', soundList => {
      this.setState({ sounds: soundList }, () => {
        sounds = soundList.reduce((sounds, sound) => {
          sounds[sound.name] = {};
          sounds[sound.name].el = document.querySelectorAll(`[data-sound="${sound.name}"]`)[0];
          sounds[sound.name].name = sound.name;
          return sounds;
        }, sounds);
      });
    });

    socket.on('play', (sound, directory) => {
      if (!sounds[sound]) return console.error(`Missing sound: ${sound}`);

      if (!sounds[sound]['file']) sounds[sound]['file'] = new Audio(`/sounds/${directory}/${sound}.mp3`);

      sounds[sound].file.play();
      sounds[sound].el.classList.add('shake');
      setTimeout(() => {
        sounds[sound].el.classList.remove('shake');
      }, 500);
    });

    socket.on('speech', data => {
      const msg = data.message;
      const msgVoice = data.voice;
      const textarea = document.getElementById('speech-log');
      let logs = this.state.logs.slice();

      if (!msg.length) return;

      if (!this.state.mute) {
        let utterance = new SpeechSynthesisUtterance(msg);
        utterance.voice = speechSynthesis
                            .getVoices()
                            .filter(voice => voice.name === msgVoice )[0];
        window.speechSynthesis.speak(utterance);
      }

      logs.push(`(${msgVoice} ${new Date().toLocaleTimeString()}) ${msg}`);
      this.setState({ logs: logs });
      textarea.scrollTop = textarea.scrollHeight;
    });

  }

  componentDidMount() {
    window.speechSynthesis.onvoiceschanged = () => {
      if (voicesLoaded) return;

      voicesLoaded = true;
      const voices = window.speechSynthesis.getVoices().map(voice => voice.name);
      this.setState({ voices: voices, selectedVoice: voices[0] });
    };

    tour.start();
  }

  inputHandler(e) {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const name = e.target.name;
    this.setState({ [name]: val });
  }

  playSound(sound) {
    const req = Request('get', `/sounds/${sound}?room=${room}`);
  }

  speech(e) {
    e.preventDefault();
    this.setState({ message: '' });
    const data = JSON.stringify({ message: this.state.message, voice: this.state.selectedVoice });
    const req = Request('post', `/speech?room=${room}`, data);
  };

  render() {
    return (
      <div>
        <h3>Have others join this room by sharing your room location</h3>
        <p className="break-word">Your room URL is <a href={url}>{url}</a></p>
        <p><Listeners listeners={this.state.listeners}/> | <a href="#" onClick={tour.replay}>Help</a></p>
        <Soundboard
          filter={this.state.filter}
          inputHandler={this.inputHandler}
          sounds={this.state.sounds}
          playSound={this.playSound} />
        <Chat
          inputHandler={this.inputHandler}
          message={this.state.message}
          voices={this.state.voices}
          speech={this.speech}
          logs={this.state.logs} />
      </div>
    )
  }
}

render(<App />, document.getElementById("app"));
