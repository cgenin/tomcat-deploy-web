import { ADD, UPDATE} from './actions';

const defaultState = [];

export function reducers(state = defaultState, action) {
  switch (action.type) {
    case UPDATE :
      return action.servers;
    case ADD :
      state.push(action.server);
      return Array.from(state);
    default :
      return state;
  }
}
