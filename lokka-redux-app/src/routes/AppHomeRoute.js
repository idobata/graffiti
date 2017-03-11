import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    currentGuy: () => Relay.QL`query { currentGuy }`,
    viewer: () => Relay.QL`query { viewer }`,
  };

  static routeName = 'AppHomeRoute';
}
