import React, { Component } from 'react';
import { connect } from 'react-redux';
import Lokka from 'lokka';
import HttpTransport from 'lokka-transport-http';
import moment from 'moment';

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
        viewer {
          id name iconUrl

          organizations {
            edges {
              node {
                id name slug

                rooms {
                  edges { node { id name } }
      } } } } } }
    `).then(({viewer}) => this.props.setCurrentGuy(viewer));
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
        room: node(id: $roomId) {
          ... on Room {
            messages(last: 25) {
              edges {
                ...${this.state.graphql.createFragment(messageEdgeFragment)}
      } } } } }
    `, {roomId: this.state.roomId}).then(
      ({room}) => this.props.addMessages(room.messages.edges.map(({node}) => node))
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

      console.log(message.body);
      this.props.addMessages([{
        id: window.btoa(`Message-${message.id}`),
        body: message.body,
        sender: {name: message.sender_name},
        createdAt: moment(message.created_at)
      }]);
    });
  }

  render() {
    const currentGuy = this.props.currentGuy;

    if (!currentGuy) { return <div /> };

    return (
      <div id='app'>
        <aside>
          <img src={currentGuy.iconUrl} alt={currentGuy.name} style={{width: '70px', borderRadius: '35px'}} />
          <form onSubmit={::this.handleSubmit}>
            <RoomSelect currentGuy={currentGuy} onRoomSelected={::this.onRoomSelected} />
            <input type='text' value={this.state.draftMessage} onChange={::this.handleTextUpdate} placeholder='Write a message...' />
            <input type='submit' value='Send' />
          </form>
        </aside>
        <main>
          <MessageList messages={this.props.messages} />
        </main>
      </div>
    );
  }
}

export default connect((state) => state, {setCurrentGuy, addMessages})(App)
