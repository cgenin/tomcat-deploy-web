import {ADD_ARTIFACTS, REMOVE_ARTIFACTS, UPDATE} from './actions';

const defaultState = {
  artifacts: []
};

export function actionReducers(state = defaultState, action) {
  let clone;
  switch (action.type) {
    case UPDATE:
      const updated = action.artifacts || [];
      clone = Object.assign({}, state);
      clone.artifacts = updated;
      return clone;
    case ADD_ARTIFACTS:
      if (!action.artifacts || action.artifacts.length === 0) {
        return state;
      }
      clone = Object.assign({}, state);
      action.artifacts.forEach(n => clone.artifacts.push(n));
      return clone;
    case REMOVE_ARTIFACTS :
      if (!action.artifacts || action.artifacts.length === 0) {
        return state;
      }
      clone = Object.assign({}, state);
      const newArtifacts = clone.artifacts.filter((orig) => action.artifacts.findIndex(x => x.name === orig.name) === -1);
      clone.artifacts = newArtifacts;
      return clone;
    default :
      return state;
  }
};
