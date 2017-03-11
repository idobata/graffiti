import React, { Component } from 'react';
import { connect } from 'react-redux';
import { connectEventd, setupSeed, fetchMessages, setCurrentRoom, sendMessage } from '../actions';

import RoomSelect from './RoomSelect';
import MessageList from './MessageList';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {draftMessage: ''};
  }

  componentDidMount() {
    this.props.connectEventd();
    this.props.setupSeed();
  }

  onRoomSelected(roomId) {
    this.props.setCurrentRoom({id: roomId});
    this.props.fetchMessages(roomId);
  }

  handleTextUpdate(e) {
    this.setState({draftMessage: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();

    if (!this.props.currentRoom) {
      alert('Please select a room');
      return;
    }

    this.props.sendMessage({roomId: this.props.currentRoom.id, source: this.state.draftMessage});
    this.setState({draftMessage: ''});
  }

  render() {
    const currentGuy = this.props.currentGuy;

    if (!currentGuy) { return <div /> };

    return (
      <div>
        <aside>
          <img src={currentGuy.iconUrl} alt={currentGuy.name} style={{width: '70px', borderRadius: '35px'}} />
        </aside>
        <RoomSelect currentGuy={currentGuy} onRoomSelected={::this.onRoomSelected} />
        <form onSubmit={::this.handleSubmit}>
          <textarea value={this.state.draftMessage} onChange={::this.handleTextUpdate} />
          <input type='submit' value='Send' />
        </form>
        <MessageList messages={this.props.messages} />
      </div>
    );
  }
}

export default connect((state) => state, {connectEventd, setupSeed, fetchMessages, setCurrentRoom, sendMessage})(App)
