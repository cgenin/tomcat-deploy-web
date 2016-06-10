import {UPDATE} from './actions';

const defaultState = [];

export function nexusVersionReducers(state = defaultState, action) {
  try {
    switch (action.type) {
      case UPDATE :
        return action.data;
      default :
        return state;
    }
  } catch (err) {
    console.error(err);
  }

  return state;
}
