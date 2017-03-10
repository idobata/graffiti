import React from 'react';
import { gql, graphql } from 'react-apollo';

class MessageItem extends React.Component {
  render() {
    const message = this.props.message;

    return (
      <div>
        <div>{message.sender.name}</div>
        <div dangerouslySetInnerHTML={{__html: message.body}} />
      </div>
    );
  }
}

const MessagesQuery = gql`
  query MessagesQuery($roomId: ID) {
    viewer {
      messages(roomId: $roomId) {
        edges {
          node {
            id
            body
            sender {
              name
            }
          }
        }
      }
    }
  }
`;


@graphql(MessagesQuery, {
  options: ({room}) => ({variables: {roomId: room ? room.id : undefined}}),
})
export default class extends React.Component {
  render() {
    if (this.props.data.loading) { return (<div />); }

    const messages = this.props.data.viewer.messages.edges.map(({node}) => <MessageItem key={node.id} message={node} />);

    return (
      <div>
        {messages}
      </div>
    )
  }
}
