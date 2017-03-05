import React from 'react';
import Relay from 'react-relay';

class App extends React.Component {
  render() {
    return (
      <div>
        <span>{this.props.current_guy.name}</span>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    current_guy: () => Relay.QL`
      fragment on Guy {
        id
        name
      }
    `,
  }
});
