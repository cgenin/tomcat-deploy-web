import React from 'react';
import Provider from 'react-redux/lib/components/Provider';
import thunkMiddleware from 'redux-thunk';
import logMiddleware from 'redux-logger';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import './App.css';
import {reducers as servers} from './modules/server/reducers';
import {testReducers as testUrl} from './modules/test/reducers';
import {areducers as artifacts} from './modules/artifacts/reducers';
import {historyReducers as history} from './modules/history/reducers';
import {actionReducers as actions} from './modules/actions/reducers';
import {loggerReducers as logger} from './modules/logger/reducers';
import {versionsReducers as versions} from './modules/versions/reducers';
import {nexusReducers as nexus} from './modules/nexus/reducers';
import {reducer as schedulers} from './modules/schedulers/reducers';
import {reducer as logHistory} from './modules/history-log/reducers';
import {reducer as toolConfiguration} from './modules/configuration/reducers';
import {nexusVersionReducers as nexusVersions} from './modules/nexus-versions/reducers';
import {initialize} from './socket';
import Routes from './routes';


const rootReducer = combineReducers(Object.assign({}, {
  servers,
  artifacts,
  history,
  actions,
  logger,
  testUrl,
  versions,
  nexus,
  nexusVersions,
  schedulers,
  logHistory,
  toolConfiguration
}));

export const store = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development')
  ? compose(applyMiddleware(thunkMiddleware, logMiddleware))(createStore)(rootReducer)
  : compose(applyMiddleware(thunkMiddleware))(createStore)(rootReducer);

initialize(store.dispatch);


const App = () => (
  <Provider store={store}>
    <Routes/>
  </Provider>
);


export default App;
