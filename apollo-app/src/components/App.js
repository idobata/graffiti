import React, { Component } from 'react';
import { gql, graphql } from 'react-apollo';
import RoomSelect from './RoomSelect';
import MessageList from './MessageList';

const SeedQuery = gql`
  query SeedQuery {
    viewer {
      name
      iconUrl

      rooms {
        edges {
          node {
            id
            name

            organization {
              id
              name
              slug
            }
          }
        }
      }
    }
  }
`;

@graphql(SeedQuery)
export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {room: undefined, draftMessage: ''};
  }

  onRoomSelected(room) {
    this.setState({room});
  }

  render() {
    if (this.props.data.loading) { return (<div />); }

    const viewer = this.props.data.viewer;

    return (
      <div>
        <aside style={{display: 'inline-block'}}>
          <img src={viewer.iconUrl} alt={viewer.name} style={{width: '70px', borderRadius: '35px'}} />
        </aside>
        <RoomSelect rooms={viewer.rooms} onRoomSelected={::this.onRoomSelected} />
        <MessageList room={this.state.room} />
      </div>
    );
  }
}
