import {SAVE, UPDATE} from './actions';

const defaultState = {
  host: '',
  username: '',
  password: ''
};

export function reducers(state = defaultState, action) {
  switch (action.type) {
    case UPDATE:
      return action.server;
    case SAVE:
      return state;
    default :
      return state;
  }
};