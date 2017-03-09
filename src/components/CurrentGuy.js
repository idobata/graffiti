import React from 'react';
import Relay from 'react-relay';

class CurrentGuy extends React.Component {
  render() {
    const current_guy = this.props.current_guy;

    return (
      <aside style={{display: 'inline-block'}}>
        <img src={current_guy.icon_url} alt={current_guy.name} style={{width: '70px', borderRadius: '35px'}} />
      </aside>
    );
  }
}

export default Relay.createContainer(CurrentGuy, {
  fragments: {
    current_guy: () => Relay.QL`
      fragment on Guy {
        id
        name
        icon_url
      }
    `,
  }
});
