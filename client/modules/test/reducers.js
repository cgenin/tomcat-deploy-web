import { SUCCESS, INPROGRESS, FAILED} from './actions';

const defaultState = {
  inProgress: false,
  success: false,
  response: '',
  code: 0
};

export function reducers(state = defaultState, action) {
  let clone;
  switch (action.type) {
    case INPROGRESS :
      clone = Object.assign({}, state);
      clone.inProgress = true;
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
      return clone;
    default :
      return state;
  }
}
