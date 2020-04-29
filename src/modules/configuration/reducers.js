import {LOAD_CONFIGURATION} from './actions';

const defaultState = {};
export function reducer(state = defaultState, action) {
  switch (action.type) {
    case LOAD_CONFIGURATION:
      return action.configuration;
    default :
      return state;
  }
}
