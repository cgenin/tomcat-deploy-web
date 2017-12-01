import React from 'react';
import './App.css';
import Provider from 'react-redux/lib/components/Provider';
import thunkMiddleware from 'redux-thunk';
import logMiddleware from 'redux-logger';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import {reducers} from './modules/server/reducers';
import {testReducers} from './modules/test/reducers';
import {areducers} from './modules/artifacts/reducers';
import {historyReducers} from './modules/history/reducers';
import {actionReducers} from './modules/actions/reducers';
import {loggerReducers} from './modules/logger/reducers';
import {versionsReducers} from './modules/versions/reducers';
import {nexusReducers} from './modules/nexus/reducers';
import {nexusVersionReducers} from './modules/nexus-versions/reducers';
import {initialize} from './socket';
import Routes from './routes';


const rootReducer = combineReducers(Object.assign({}, {
  servers: reducers,
  artifacts: areducers,
  history: historyReducers,
  actions: actionReducers,
  logger: loggerReducers,
  testUrl: testReducers,
  versions: versionsReducers,
  nexus: nexusReducers,
  nexusVersions: nexusVersionReducers
}));

export const store = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development')
  ? compose(applyMiddleware(thunkMiddleware, logMiddleware))(createStore)(rootReducer)
  : compose(applyMiddleware(thunkMiddleware))(createStore)(rootReducer);

initialize(store.dispatch);


const App = () => {
  return (
    <Provider store={store}>
      <Routes/>
    </Provider>
  );
};

export default App;
