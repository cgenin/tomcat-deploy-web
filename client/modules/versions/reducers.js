import {UPDATE} from './actions';

const defaultState = {
  ref: {}
};

export function versionsReducers(state = defaultState, action) {
  try {
    switch (action.type) {
      case UPDATE :
        return {ref: action.data};
      default :
        return state;
    }
  } catch (err) {
    console.error(err);
  }

  return state;
}
