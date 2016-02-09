import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/lib/createHashHistory';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import logMiddleware from 'redux-logger';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Router, Route, hashHistory } from 'react-router'
import { syncHistory, routeReducer } from 'react-router-redux'
import {reducers} from './modules/server/reducers';
import {areducers} from './modules/artifacts/reducers';
import {mReducers} from './modules/message/reducers';


import routes from './routes';

const history = hashHistory;
const reduxRouterMiddleware = syncHistory(history);

let rootReducer = combineReducers(Object.assign({}, {
    routing: routeReducer,
    server: reducers,
    artifacts: areducers,
    messaging: mReducers
}));

export const store = compose(
    applyMiddleware(
        thunkMiddleware,
        logMiddleware(),
        reduxRouterMiddleware
    )
)(createStore)(rootReducer);

/*
store.subscribe(
    state => console.log(state),
    (previousState, state) => previousState.server !== state.server
);*/

// Needed befor react 1.0 release
injectTapEventPlugin();

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            {routes}
        </Router>
    </Provider>
    , document.getElementById('app')
);
