import 'babel-polyfill/dist/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Provider from 'react-redux/lib/components/Provider';
import thunkMiddleware from 'redux-thunk';
import logMiddleware from 'redux-logger';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import Router from 'react-router/lib/Router';
import browserHistory from 'react-router/lib/browserHistory';
import {syncHistory, routeReducer} from 'react-router-redux';
import {reducers} from './modules/server/reducers';
import {testReducers} from './modules/test/reducers';
import {areducers} from './modules/artifacts/reducers';
import {actionReducers} from './modules/actions/reducers';
import {loggerReducers} from './modules/logger/reducers';
import {versionsReducers} from './modules/versions/reducers';
import {nexusReducers} from './modules/nexus/reducers';
import {initialize} from './socket';
import routes from './routes';

const history = browserHistory;
const reduxRouterMiddleware = syncHistory(history);

const rootReducer = combineReducers(Object.assign({}, {
  routing: routeReducer,
  servers: reducers,
  artifacts: areducers,
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
