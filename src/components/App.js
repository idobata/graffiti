import React from 'react';
import Relay from 'react-relay';
import ViewerAccount from './ViewerAccount';
import OrganizationList from './OrganizationList';

class App extends React.Component {
  render() {
    return (
      <div>
        <ViewerAccount current_guy={this.props.current_guy} />
        <OrganizationList organizations={this.props.organizations} />
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    current_guy: () => Relay.QL`
      fragment on Guy {
        id
        ${ViewerAccount.getFragment('current_guy')}
      }
    `,
    organizations: () => Relay.QL`
      fragment on OrganizationConnection {
        ${OrganizationList.getFragment('organizations')}
      }
    `,
  }
});
