import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import App from './components/App';
import AppHomeRoute from './routes/AppHomeRoute';

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer(`${process.env.IDOBATA_URL}/api/graphql`, {
    headers: {
      Authorization: `Bearer ${process.env.IDOBATA_API_TOKEN}`
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
