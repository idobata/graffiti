import React from 'react';

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {roomId: undefined};
  }

  handleChange(e) {
    const roomId = e.target.value;

    this.setState({roomId});
    this.props.onRoomSelected(roomId);
  }

  render() {
    return (
      <select value={this.state.roomId} onChange={::this.handleChange}>{this.renderOptions()}</select>
    );
  }

  renderOptions() {
    return this.props.currentGuy.organizations.edges.reduce((acc, edge) => {
      const org = edge.node;

      return acc.concat(
        org.rooms.edges.map(({node}) => <option key={node.id} value={node.id}>{org.slug}/{node.name}</option>)
      );
    }, []);
  }
}
