import React from 'react';
import Relay from 'react-relay';

class CurrentGuy extends React.Component {
  render() {
    const currentGuy = this.props.currentGuy;

    return (
      <aside style={{display: 'inline-block'}}>
        <img src={currentGuy.iconUrl} alt={currentGuy.name} style={{width: '70px', borderRadius: '35px'}} />
      </aside>
    );
  }
}

export default Relay.createContainer(CurrentGuy, {
  fragments: {
    currentGuy: () => Relay.QL`
      fragment on Guy {
        id
        name
        iconUrl
      }
    `,
  }
});
