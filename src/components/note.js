import React from 'react';
import {render} from 'react-dom';

class Note extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: true,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ active: false });
      this.props.removeNote(this.props.id);
    }, 1000);
  }

  render() {
    return (
      <div className={`toast ${this.state.active ? 'toast--active' : ''}`}>
        {this.props.message}
      </div>
    )
  }
}

export default Note;