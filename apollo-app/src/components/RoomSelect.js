import React from 'react';

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {roomId: undefined};
  }

  handleChange(e) {
    const roomId = e.target.value;

    this.setState({roomId});
    this.props.onRoomSelected(this.props.rooms.edges.find(({node}) => node.id == roomId).node);
  }

  render() {
    return (
      <select value={this.state.roomId} onChange={::this.handleChange}>{this.renderOptions()}</select>
    );
  }

  renderOptions() {
    return this.props.rooms.edges.map(
      ({node}) => <option key={node.id} value={node.id}>{node.organization.slug}/{node.name}</option>
    )
  }
}
