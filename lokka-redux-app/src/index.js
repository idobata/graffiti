import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import { Provider } from 'react-redux';

import reducers from './reducers';
import App from './components/App';

const loggerMiddleware = createLogger();

const store = createStore(
  reducers,
  applyMiddleware(loggerMiddleware)
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
