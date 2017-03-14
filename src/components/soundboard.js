import React from 'react';
import {render} from 'react-dom';
import Button from './button';

class Soundboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const sounds = this.props.sounds.filter((sound) => {
      return sound.name.includes(this.props.filter) ? sound : false;
    });

    return (
      <div className="soundpad">
        <div id="filter" className="form-group">
          <label>Sound Filter</label>
          <input type="text" placeholder="filter" value={this.props.filter} onChange={this.props.setFilter} />
        </div>
        <div className="row">
          {sounds.map((sound, id) => {
            return (
              <div className="col col2" key={id} >
                <Button sound={sound} playSound={this.props.playSound} />
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default Soundboard;
