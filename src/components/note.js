import React from 'react';
import {render} from 'react-dom';

class Note extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.removeNote(this.props.id);
    }, 3000);
  }

  render() {
    return (
      <div className="toast">
        {this.props.message}
      </div>
    )
  }
}

export default Note;