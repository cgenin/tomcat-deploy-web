import {UPDATE} from './actions';

const defaultState = [];



export function historyReducers(state = defaultState, action) {
  switch (action.type) {
    case UPDATE:
      return action.arr;
    default :
      return state;
  }
}
