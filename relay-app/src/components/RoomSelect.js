import React from 'react';
import Relay from 'react-relay';

class RoomSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {roomId: undefined};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const roomId = e.target.value;

    this.setState({roomId});
    this.props.onRoomSelected(this.props.rooms.edges.find(({node}) => node.id == roomId).node);
  }

  render() {
    const selected = this.props.selected ? this.props.selected.id : null;

    return (
      <select value={this.state.roomId} onChange={this.handleChange} selected={selected}>{this.renderOptions()}</select>
    );
  }

  renderOptions() {
    return this.props.rooms.edges.map(
      ({node}) => <option key={node.id} value={node.id}>{node.organization.slug}/{node.name}</option>
    )
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
            organization { slug }
          }
        }
      }
    `,
  }
});
