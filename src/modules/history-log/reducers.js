import {UPDATE, LOADING} from './actions';

const defaultState = {
  loading: false,
  history: []
};


export function reducer(state = defaultState, action) {
  switch (action.type) {
    case LOADING:
      return {loading: true, history: []};
    case UPDATE:
      const {options, results} = action.result;
      return {loading: false, history: results, options};
    default :
      return state;
  }
}
