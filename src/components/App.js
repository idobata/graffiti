import React from 'react';
import Relay from 'react-relay';
import ViewerAccount from './ViewerAccount';
import RoomSelect from './RoomSelect';
import MessageList from './MessageList';

class App extends React.Component {
  render() {
    return (
      <div>
        <ViewerAccount current_guy={this.props.current_guy} />
        <RoomSelect rooms={this.props.current_guy.rooms} />
        <MessageList messages={this.props.messages} />
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    current_guy: () => Relay.QL`
      fragment on Guy {
        id
        ${ViewerAccount.getFragment('current_guy')}

        rooms(first: 1000) {
          ${RoomSelect.getFragment('rooms')}
        }
      }
    `,
    messages: () => Relay.QL`
      fragment on MessageConnection {
        ${MessageList.getFragment('messages')}
      }
    `,
  }
});
