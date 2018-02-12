import {UPDATE, DELETE} from './actions';

const defaultState = [];

export function reducer(state = defaultState, action) {
  switch (action.type) {
    case UPDATE:
      return action.schedulers;
    case DELETE :
      const scheduler = action.scheduler;
      const index = state.findIndex((o) => o === scheduler);
      if (index !== -1) {
        state.splice(index, 1);
      }
      return Array.from(state);
    default :
      return state;
  }
}
