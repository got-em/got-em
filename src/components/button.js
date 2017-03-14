import React from 'react';
import {render} from 'react-dom';

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.buttonHandler = this.buttonHandler.bind(this);
  }

  buttonHandler() {
    this.props.playSound(this.props.sound.name);
  }

  render() {
    return (
      <button className="btn soundpad-btn" data-sound={this.props.sound.name} onClick={this.buttonHandler}>{this.props.sound.name}</button>
    )
  }
}

export default Button;