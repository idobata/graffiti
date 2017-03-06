import React from 'react';
import Relay from 'react-relay';

class ViewerAccount extends React.Component {
  render() {
    const current_guy = this.props.current_guy;

    return (
      <aside>
        <img src={current_guy.icon_url} alt='' />
        <span>{current_guy.id}: {current_guy.name}</span>
      </aside>
    );
  }
}

export default Relay.createContainer(ViewerAccount, {
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
