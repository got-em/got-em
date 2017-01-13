import React from 'react';
import {render} from 'react-dom';
import Button from './button.jsx';

const socket = io();
const room = window.location.pathname.split('/').pop();
const url = window.location.href;
let sounds = {};
let voicesLoaded = false;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sounds: [{"name":"badumtss","directory":"default"},{"name":"boing","directory":"default"},{"name":"cantseemenow","directory":"default"},{"name":"damson","directory":"default"},{"name":"doh","directory":"default"},{"name":"dream","directory":"default"},{"name":"fart","directory":"default"},{"name":"goat","directory":"default"},{"name":"horn","directory":"default"},{"name":"inception","directory":"default"},{"name":"laugh","directory":"default"},{"name":"pleeya","directory":"default"},{"name":"sad","directory":"default"},{"name":"victory","directory":"default"},{"name":"pikachu","directory":"pokemon"},{"name":"nooo","directory":"starwars"},{"name":"r2","directory":"starwars"},{"name":"fantastic","directory":"trump"},{"name":"suffer","directory":"trump"},{"name":"wrong","directory":"trump"}],
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
  }

  componentDidMount() {
    const self = this;
    socket.emit('joinroom', room);
    socket.on('reconnect', function() {
      socket.emit('joinroom', room);
    });
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
        setTimeout(function(){
          notificationManager.removeChild(toast);
        }, 300);
      });
    });
    socket.on('load', function(soundList) {
      sounds = soundList.reduce(function(sounds, sound) {
        sounds[sound.name] = {};
        sounds[sound.name].el = document.querySelectorAll('[data-sound="' + sound.name  + '"]')[0];
        sounds[sound.name].name = sound.name;
        return sounds;
      }, sounds);
    });
    socket.on('play', function(sound, directory) {
      if (!sounds[sound]) return console.error('Missing sound: ' + sound);

      if (!sounds[sound]['file']) sounds[sound]['file'] = new Audio('/sounds/' + directory + '/' + sound + '.mp3');

      sounds[sound].file.play();
      sounds[sound].el.classList.add('shake');
      setTimeout(function() {
        sounds[sound].el.classList.remove('shake');
      }, 500);
    });

    window.speechSynthesis.onvoiceschanged = function() {
      if (voicesLoaded) return;

      voicesLoaded = true;
      let voices = [];
      window.speechSynthesis.getVoices().forEach(function(voice) {
        voices.push(voice.name);
      });
      self.setState({ voices: voices, selectedVoice: voices[0] });
    };

    socket.on('speech', function(data) {
      var msg = data.message;
      var msgVoice = data.voice;

      if (!msg.length) return;

      if (!self.state.mute) {
        let utterance = new SpeechSynthesisUtterance(msg);
        utterance.voice = speechSynthesis
                            .getVoices()
                            .filter(function(voice) {
                              return voice.name === msgVoice;
                            })[0];
        window.speechSynthesis.speak(utterance);
      }

      let logs = self.state.logs;
      logs.push('(' + msgVoice + ' ' + new Date().toLocaleTimeString() + ') ' + msg + '\n');
      self.setState({ logs: logs });
      let textarea = document.getElementById('speech-log');
      textarea.scrollTop = textarea.scrollHeight;
    });

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
  playSound(sound) {
    var request = new XMLHttpRequest();
    request.open('GET', '/sounds/' + sound + '?room=' + room, true);
    request.onerror = function() {
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

  render() {
    const self = this;
    const sounds = this.state.sounds.filter((sound) => {
      return sound.name.includes(this.state.filter) ? sound : false;
    });
    return (
      <div>
        <div className="text-center">
          <h3>Have others join this room by sharing your room location</h3>
          <p>Your room URL is <a href={url}>{url}</a></p>
        </div>
        <div className="soundpad">
          <div className="form-group">
            <label>Sound Filter</label>
            <input type="text" className="form-control" placeholder="filter" value={this.state.filter} onChange={this.setFilter} />
          </div>
          <div className="row">
            {sounds.map(function(sound, id) {
              return (
                <Button key={id} sound={sound} playSound={self.playSound} />
              )
            })}
          </div>
        </div>
        <div id="voice">
           <h3>GOT'EM VOICE ALPHA</h3>
           <div className="row">
              <div className="col-sm-5">
                 <form className="speech">
                    <div className="form-group">
                       <label>Voice ALPHA</label>
                       <select className="select-voice form-control">
                        {this.state.voices.map((voice, id) => {
                          return <option key={id} value={voice}>{voice}</option>
                        })}
                       </select>
                    </div>
                    <div className="form-group">
                      <input onChange={this.setMessage} value={this.state.message} type="text" name="message" placeholder="Enter text-to-speech message" className="input-speech form-control" />
                    </div>
                    <div className="form-group">
                      <button onClick={this.speech} type="submit" className="btn btn-default">Submit</button>
                    </div>
                    <div className="form-group">
                       <p><label><input type="checkbox" className="mute" onChange={this.setMute}/>&nbsp;Local Mute</label></p>
                    </div>
                 </form>
              </div>
              <div className="col-sm-7">
                <div className="form-group">
                  <label htmlFor="speech-log">Text-to-speech Log</label>
                  <textarea id="speech-log" rows="10" readOnly className="textarea-speech-log form-control" value={this.state.logs} />
                </div>
              </div>
           </div>
        </div>
      </div>
    )
  }
}

render(<App />, document.getElementById("app"));