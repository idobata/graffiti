import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    current_guy: () => Relay.QL`
      query {
        current_guy
      }
    `,
    organizations: () => Relay.QL`
      query {
        organizations
      }
    `,
  };

  static routeName = 'AppHomeRoute';
}
