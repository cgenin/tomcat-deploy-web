import { ADD, UPDATE} from './actions';

const defaultState = {};

export function nexusReducers(state = defaultState, action) {
  switch (action.type) {
    case UPDATE :
      return action.nexus;
    case ADD :
      return action.nexus;
    default :
      return state;
  }
}
