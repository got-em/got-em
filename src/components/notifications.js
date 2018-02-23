import React from 'react';
import {render} from 'react-dom';
import Note from './note';
import shortid from 'shortid';

class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
    this.removeNote = this.removeNote.bind(this);

    props.socket.on('notification', msg => {
      const messages = this.state.messages.slice();
      const messageObj = {
        id: shortid.generate(),
        message: msg,
      };
      messages.push(messageObj);
      this.setState({ messages });
    });
  }

  removeNote(id) {
    const messages = this.state.messages.filter(m => m.id != id);
    this.setState({ messages });
  }

  render() {
    return (
      <div className="notification-manager">
        {this.state.messages.length > 0 &&
          this.state.messages.map(m => <Note key={m.id} id={m.id} message={m.message} removeNote={this.removeNote} />)
        }
      </div>
    )
  }
}

export default Notifications;