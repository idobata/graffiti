import React from 'react';
import Relay from 'react-relay';

class OrganizationList extends React.Component {
  render() {
    const items = this.props.organizations.edges.map((edge) => <li key={edge.node.id}>{edge.node.name}</li>)

    return (
      <ul>{items}</ul>
    );
  }
}

export default Relay.createContainer(OrganizationList, {
  fragments: {
    organizations: () => Relay.QL`
      fragment on OrganizationConnection {
        edges {
          node {
            id
            name
            slug
          }
        }
      }
    `,
  }
});
