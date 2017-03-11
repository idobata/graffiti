import React from 'react';

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

export default class extends React.Component {
  render() {
    if (this.props.messages.length == 0) { return (<div />); }

    return (
      <div>
        {this.props.messages.map((message) => <MessageItem message={message} />)}
      </div>
    )
  }
}
