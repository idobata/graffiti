import React from 'react';
import Relay from 'react-relay';

class RoomSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {roomId: undefined};
  }

  handleChange(e) {
    this.setState({roomId: e.target.value});
  }

  render() {
    const options = this.props.rooms.edges.map(({node}) => <option key={node.id} value={node.id}>{node.organization.slug}/{node.name}</option>);

    return (
      <select value={this.state.roomId}>{options}</select>
    );
  }
}

export default Relay.createContainer(RoomSelect, {
  fragments: {
    rooms: () => Relay.QL`
      fragment on RoomConnection {
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
    `,
  }
});
