import React, { Component } from 'react';
import { connect } from 'react-redux';
import Lokka from 'lokka';
import HttpTransport from 'lokka-transport-http';

import RoomSelect from './RoomSelect';
import MessageList from './MessageList';
import { setCurrentGuy, addMessages } from '../actions';

import _ from '../styles/app.sass';

const clientId = String(Math.random());
const messageEdgeFragment = `
  fragment on MessageEdge {
    node {
      id body sender { name }, createdAt
    }
  }
`;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {roomId: undefined, graphql: undefined, draftMessage: ''};
  }

  componentDidMount() {
    const graphql = this.createGraphQLClient();

    this.connectEventd();
    this.setState({graphql}, () => this.setupSeed());
  }

  onRoomSelected(roomId) {
    this.setState({roomId}, () => this.loadMessages())
  }

  handleTextUpdate(e) {
    this.setState({draftMessage: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();

    if (!this.state.roomId || !this.state.draftMessage) {
      alert('Please select a room and write message');
      return;
    }

    this.sendMessage({roomId: this.state.roomId, source: this.state.draftMessage});
    this.setState({draftMessage: ''});
  }

  setupSeed() {
    this.state.graphql.query(`
      {
        currentGuy {
          id name iconUrl

          organizations {
            edges {
              node {
                id name slug

                rooms {
                  edges { node { id name } }
      } } } } } }
    `).then(({currentGuy}) => this.props.setCurrentGuy(currentGuy));
  }

  createGraphQLClient() {
    const transport = new HttpTransport(`${process.env.IDOBATA_URL}/api/graphql`, {
      headers: {
        'Authorization': `Bearer ${process.env.IDOBATA_API_TOKEN}`,
        'X-Idobata-Client-ID': clientId
      }
    });

    return new Lokka({transport});
  }

  loadMessages() {
    this.state.graphql.query(`
      query _($roomId: ID!) {
        messages(roomId: $roomId) {
          edges {
            ...${this.state.graphql.createFragment(messageEdgeFragment)}
          } } }
    `, {roomId: this.state.roomId}).then(
      ({messages}) => this.props.addMessages(messages.edges.map(({node}) => node))
    );
  }

  sendMessage(message) {
    this.state.graphql.mutate(`
      ($input: CreateMessageInput!) {
        newMessage: createMessage(input: $input) {
          messageEdge {
            ...${this.state.graphql.createFragment(messageEdgeFragment)}
          } } }
    `, {input: message}).then(
      ({newMessage}) => this.props.addMessages([newMessage.messageEdge.node])
    );
  }

  connectEventd() {
    const eventSource = new EventSource(
      `${process.env.IDOBATA_EVENTD_URL}/api/stream?client_id=${clientId}&access_token=${process.env.IDOBATA_API_TOKEN}`
    );

    eventSource.addEventListener('event', (e) => {
      const {type, data} = JSON.parse(e.data);

      if (type !== 'message:created') { return; }

      const message = data.message;

      if (window.btoa(`Room-${message.room_id}`) !== this.state.roomId) { return; }

      this.props.addMessages([{
        id: window.btoa(`Message-${message.id}`),
        body: message.body,
        sender: {name: message.sender_name},
        createdAt: new Date() // TODO: use message.created_at
      }]);
    });
  }

  render() {
    const currentGuy = this.props.currentGuy;

    if (!currentGuy) { return <div /> };

    return (
      <div>
        <aside>
          <img src={currentGuy.iconUrl} alt={currentGuy.name} style={{width: '70px', borderRadius: '35px'}} />
          <RoomSelect currentGuy={currentGuy} onRoomSelected={::this.onRoomSelected} />
        </aside>
        <main>
          <form onSubmit={::this.handleSubmit}>
            <textarea value={this.state.draftMessage} onChange={::this.handleTextUpdate} placeholder='Write a message...' />
            <input type='submit' value='Send' />
          </form>
          <MessageList messages={this.props.messages} />
        </main>
      </div>
    );
  }
}

export default connect((state) => state, {setCurrentGuy, addMessages})(App)
