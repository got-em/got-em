import React from 'react';
import {render} from 'react-dom';

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div id="voice">
        <h3>GOT'EM VOICE ALPHA</h3>
        <div className="row">
          <div className="col-sm-5">
            <form className="speech">
              <div className="form-group">
                <label>Voice ALPHA</label>
                <select onChange={this.props.setVoice} className="select-voice form-control">
                  {this.props.voices.map((voice, id) => {
                    return <option key={id} value={voice}>{voice}</option>
                  })}
                </select>
              </div>
              <div className="form-group">
                <input onChange={this.props.setMessage} value={this.props.message} type="text" name="message" placeholder="Enter text-to-speech message" className="input-speech form-control" />
              </div>
              <div className="form-group">
                <button onClick={this.props.speech} type="submit" className="btn btn-default">Submit</button>
              </div>
              <div className="form-group">
                <p><label><input type="checkbox" className="mute" onChange={this.props.setMute}/>&nbsp;Local Mute</label></p>
              </div>
            </form>
          </div>
          <div className="col-sm-7">
            <div className="form-group">
              <label htmlFor="speech-log">Text-to-speech Log</label>
              <textarea id="speech-log" rows="10" readOnly className="textarea-speech-log form-control" value={this.props.logs} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Chat;