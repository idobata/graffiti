import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setupSeed, fetchMessages, sendMessage } from '../actions';

import RoomSelect from './RoomSelect';
import MessageList from './MessageList';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {room: undefined, draftMessage: ''};
  }

  componentDidMount() {
    this.props.setupSeed();
  }

  onRoomSelected(roomId) {
    const room = this.props.currentGuy.organizations.edges.reduce(
      (acc, {node}) => acc.concat(node.rooms.edges),
      []
    ).find(
      ({node}) => node.id == roomId
    ).node;

    this.setState({room});
    this.props.fetchMessages(room.id);
  }

  handleTextUpdate(e) {
    this.setState({draftMessage: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();

    if (!this.state.room) {
      alert('Please select a room');
      return;
    }

    this.props.sendMessage({roomId: this.state.room.id, source: this.state.draftMessage});
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

export default connect((state) => state, {setupSeed, fetchMessages, sendMessage})(App)
