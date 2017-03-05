import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import App from './components/App';
import AppHomeRoute from './routes/AppHomeRoute';

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('http://localhost:3000/api/graphql', {
    headers: {
      Authorization: 'Bearer 81bcbb78a5041b8c0a69ed163458661b2c0f3ca27031d8b2bb236f2c4881fe68'
    }
  })
);

ReactDOM.render(
  <Relay.Renderer
    environment={Relay.Store}
    Container={App}
    queryConfig={new AppHomeRoute()}
  />,
  document.getElementById('root')
);
