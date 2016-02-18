import { SUCCESS, INPROGRESS, FAILED} from './actions';

const defaultState = {
  inProgress: false,
  success: false,
  response: '',
  url: '',
  code: 0
};

export function testReducers(state = defaultState, action) {
  let clone;
  switch (action.type) {
    case INPROGRESS :
      clone = Object.assign({}, state);
      clone.inProgress = true;
      clone.url = action.url;
      return clone;
    case SUCCESS :
      clone = Object.assign({}, state);
      clone.inProgress = false;
      clone.success = true;
      clone.response = action.data;
      return clone;
    case FAILED :
      clone = Object.assign({}, state);
      clone.inProgress = false;
      clone.success = false;
      clone.code = action.code;
      clone.response = action.data;
      return clone;
    default :
      return state;
  }
}
