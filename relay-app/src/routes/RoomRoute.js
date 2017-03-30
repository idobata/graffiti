import Relay from 'react-relay';

export default class extends Relay.Route {
  static paramDefinitions = {
    roomId: {required: true}
  };

  static queries = {
    viewer: () => Relay.QL`query { viewer }`,
    room: () => Relay.QL`query { room: node(id: $roomId) }`,
  };

  static routeName = 'Roomoute';
}
