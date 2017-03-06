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
        <h3>GOT'EM VOICE</h3>
        <div className="row">
          <div className="col col6">
            <form>
              <div className="form-group">
                <label>Voice</label>
                <select onChange={this.props.setVoice}>
                  {this.props.voices.map((voice, id) => {
                    return <option key={id} value={voice}>{voice}</option>
                  })}
                </select>
              </div>
              <div className="form-group">
                <label>Message</label>
                <input onChange={this.props.setMessage} value={this.props.message} type="text" name="message" placeholder="message" />
              </div>
              <button onClick={this.props.speech} type="submit" className="btn btn-default">Submit</button>
              <p><label><input type="checkbox" onChange={this.props.setMute}/>&nbsp;Local Mute</label></p>
            </form>
          </div>
          <div className="col col6">
            <label htmlFor="speech-log">Chat</label>
            <textarea id="speech-log" rows="10" readOnly value={this.props.logs} />
          </div>
        </div>
      </div>
    )
  }
}

export default Chat;