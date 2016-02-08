import thunkMiddleware from 'redux-thunk';
import logMiddleware from 'redux-logger';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Router, Route, browserHistory } from 'react-router'
import { syncHistory, routeReducer } from 'react-router-redux'
import {reducers} from './modules/server/reducers';
import {areducers} from './modules/artifacts/reducers';


//syncHistory(history);
//const createStoreWithMiddleware = applyMiddleware(reduxRouterMiddleware)(createStore)
const reduxRouterMiddleware = syncHistory(browserHistory);

let rootReducer = combineReducers(Object.assign({}, {
    routing: routeReducer,
    server: reducers,
    artifacts: areducers
}));

export const store = compose(
    applyMiddleware(
        thunkMiddleware,
        logMiddleware(),
        reduxRouterMiddleware
    )
)(createStore)(rootReducer);