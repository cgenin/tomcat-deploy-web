import {UPDATE, LOADING} from './actions';

const defaultState = {
  loading: false,
  logs: []
};


export function reducer(state = defaultState, action) {
  switch (action.type) {
    case LOADING:
      return {loading: true, history: []};
    case UPDATE:
      return {loading: false, history: action.arr};
    default :
      return state;
  }
}
