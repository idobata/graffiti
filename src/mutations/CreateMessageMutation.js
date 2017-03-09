import Relay from 'react-relay';

export default class extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation { createMessage }`;
  }

  getVariables() {
    return {room_id: this.props.room.id, source: this.props.source};
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CreateMessagePayload {
        messageEdge {
          node {
            id
            body
            format
            sender
            room
            mentions
            created_at
          }
        }
      }
    `;
  }

  getConfigs() {
    // TODO
    return [];
  }
}
