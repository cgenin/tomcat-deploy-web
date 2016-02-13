import {UPDATE, DELETE} from './actions';

const defaultState = [];

export function areducers(state = defaultState, action) {
  switch (action.type) {
    case UPDATE:
      return action.artifacts;
    case DELETE :
      const n = action.name;
      const index = state.findIndex((o) => o.name === n);
      if (index !== -1) {
        state.splice(index, 1);
      }
      return Array.from(state);
    default :
      return state;
  }
};
