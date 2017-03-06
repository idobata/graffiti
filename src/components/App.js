import React from 'react';
import Relay from 'react-relay';
import ViewerAccount from './ViewerAccount';

class App extends React.Component {
  render() {
    return (
      <ViewerAccount current_guy={this.props.current_guy} />
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
  }
});
