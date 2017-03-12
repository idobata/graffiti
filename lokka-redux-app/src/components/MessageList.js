import React from 'react';

class MessageItem extends React.Component {
  render() {
    const message = this.props.message;

    return (
      <div className='message-item'>
        <div className='sender'>{message.sender.name}</div>
        <div className='message-body' dangerouslySetInnerHTML={{__html: message.body}} />
        <time>{message.createdAt.toString()}</time>
      </div>
    );
  }
}

export default class extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.messages !== this.props.messages;
  }

  render() {
    if (this.props.messages.length == 0) { return (<div />); }

    const messages = this.props.messages.sort((a, b) => {
      if (a.createdAt < b.createdAt) { return -1; }
      if (a.createdAt > b.createdAt) { return 1; }

      return 0;
    }).reverse();

    return (
      <div className='message-list'>
        {messages.map((message) => <MessageItem key={message.id} message={message} />)}
      </div>
    )
  }
}
