import { UPDATE} from './actions';

const defaultState = {
  ref: {}
};

export function versionsReducers(state = defaultState, action) {
  let clone;
  switch (action.type) {
    case UPDATE :
      clone = Object.assign({},state);
      clone.ref = action.data;
      return clone;
    default :
      return state;
  }
}
