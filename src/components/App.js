import React from 'react';
import Relay from 'react-relay';
import CurrentGuy from './CurrentGuy';
import RoomSelect from './RoomSelect';
import MessageList from './MessageList';
import CreateMessageMutation from '../mutations/CreateMessageMutation';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {room: undefined, draftMessage: ''};

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
    this.setState({room});
    this.props.relay.setVariables({roomId: room.id});
  }

  render() {
    return (
      <div>
        <CurrentGuy current_guy={this.props.current_guy} />
        <form onSubmit={this.handleSubmit}>
          <RoomSelect rooms={this.props.current_guy.rooms} onRoomSelected={this.handleRoomSelected} />
          <textarea value={this.state.draftMessage} onChange={this.handleChange} />
          <input type='submit' value='Send' />
        </form>
        <MessageList messages={this.props.viewer.messages} />
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  initialVariables: {
    roomId: undefined,
    messageChunkSize: 25
  },

  fragments: {
    current_guy: () => Relay.QL`
      fragment on Guy {
        id
        ${CurrentGuy.getFragment('current_guy')}

        rooms(first: 1000) {
          ${RoomSelect.getFragment('rooms')}
        }
      }
    `,
    viewer: () => Relay.QL`
      fragment on Viewer {
        messages(first: $messageChunkSize, room_id: $roomId) {
          ${MessageList.getFragment('messages')}
        }
      }
    `,
  }
})
