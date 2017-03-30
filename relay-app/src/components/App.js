import React from 'react';
import Relay from 'react-relay';
import CurrentGuy from './CurrentGuy';
import RoomSelect from './RoomSelect';
import MessageList from './MessageList';
import CreateMessageMutation from '../mutations/CreateMessageMutation';

class App extends React.Component {
  constructor(props) {
    super(props);

    const room = window.history.state && window.history.state.room;

    this.state = {room, draftMessage: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRoomSelected = this.handleRoomSelected.bind(this);
  }

  handleChange(e) {
    this.setState({draftMessage: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();

    if (!this.state.room) {
      alert('Please select a room');
      return;
    }

    this.props.relay.commitUpdate(
      new CreateMessageMutation({room: this.state.room, source: this.state.draftMessage})
    );

    this.setState({draftMessage: ''});
  }

  handleRoomSelected(room) {
    window.history.pushState({room}, room.name, ''); // TODO: URL を変更するには直接きたときにも対応する必要がある
    window.dispatchEvent(new CustomEvent('roomSelected', {detail: {room}}));
  }

  render() {
    const messages = this.props.room ? this.props.room.messages : this.props.viewer.timeline;

    return (
      <div>
        <CurrentGuy currentGuy={this.props.viewer} />
        <form onSubmit={this.handleSubmit}>
          <RoomSelect rooms={this.props.viewer.rooms} selected={this.state.room} onRoomSelected={this.handleRoomSelected} />
          <textarea value={this.state.draftMessage} onChange={this.handleChange} />
          <input type='submit' value='Send' />
        </form>
        <MessageList messages={messages} />
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  initialVariables: {
    messageChunkSize: 25
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Guy {
        id
        ${CurrentGuy.getFragment('currentGuy')}

        rooms(first: 1000) {
          ${RoomSelect.getFragment('rooms')}
        }

        timeline(last: $messageChunkSize) {
          ${MessageList.getFragment('messages')}
        }
      }
    `,
    room: () => Relay.QL`
      fragment on Room {
        id
        name

        messages(last: $messageChunkSize) {
          ${MessageList.getFragment('messages')}
        }
      }
    `,
  }
})
