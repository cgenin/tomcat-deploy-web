import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import logMiddleware from 'redux-logger';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Router, hashHistory } from 'react-router';
import { syncHistory, routeReducer } from 'react-router-redux';
import {reducers} from './modules/server/reducers';
import {testReducers} from './modules/test/reducers';
import {areducers} from './modules/artifacts/reducers';
import {mReducers} from './modules/message/reducers';
import {actionReducers} from './modules/actions/reducers';
import {loggerReducers} from './modules/logger/reducers';
import {versionsReducers} from './modules/versions/reducers';
import {nexusReducers} from './modules/nexus/reducers';
import {initialize} from './socket';


import routes from './routes';

const history = hashHistory;
const reduxRouterMiddleware = syncHistory(history);

const rootReducer = combineReducers(Object.assign({}, {
  routing: routeReducer,
  servers: reducers,
  artifacts: areducers,
  messaging: mReducers,
  actions: actionReducers,
  logger: loggerReducers,
  testUrl: testReducers,
  versions: versionsReducers,
  nexus: nexusReducers
}));

export const store = compose(
  applyMiddleware(
    thunkMiddleware,
    logMiddleware(),
    reduxRouterMiddleware
  )
)(createStore)(rootReducer);

injectTapEventPlugin();

initialize(store.dispatch);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      {routes}
    </Router>
  </Provider>
  , document.getElementById('app')
);
