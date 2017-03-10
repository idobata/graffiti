import React from 'react';
import Relay from 'react-relay';

class MessageItem extends React.Component {
  render() {
    const message = this.props.message;

    return (
      <div>
        <div>{message.room.organization.slug}/{message.room.name}</div>
        <div>{message.sender.name}</div>
        <div dangerouslySetInnerHTML={{__html: message.body}} />
      </div>
    );
  }
}

class MessageList extends React.Component {
  render() {
    const messages = this.props.messages.edges.map(({node}) => <MessageItem key={node.id} message={node} />);

    return (
      <div>
        {messages}
      </div>
    )
  }
}

export default Relay.createContainer(MessageList, {
  fragments: {
    messages: () => Relay.QL`
      fragment on MessageConnection {
        edges {
          node {
            body

            room {
              name

              organization {
                slug
              }
            }

            sender {
              name
            }
          }
        }
      }
    `,
  }
});
