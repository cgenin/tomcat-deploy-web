import {CLEAR, END, ERROR, LOG, START} from './actions';

const defaultState = [];

export function loggerReducers(state = defaultState, action) {
  let msg;
  let dt;
  switch (action.type) {
    case CLEAR:
      return [];
    case START:
      dt = new Date();
      msg = '*****************************';
      state.push({dt, msg, error: false});
      return Array.from(state);
    case END:
      dt = new Date();
      msg = '************* end ***********';
      state.push({dt, msg, error: false});
      return Array.from(state);
    case LOG:
      dt = new Date();
      msg = action.msg;
      state.push({dt, msg, error: false});
      return Array.from(state);
    case ERROR:
      dt = new Date();
      msg = action.msg;
      state.push({dt, msg, error: true});
      return Array.from(state);
    default :
      return state;
  }
}
