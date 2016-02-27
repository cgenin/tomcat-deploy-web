import {UPDATE_HISTORY, ADD_ARTIFACTS, REMOVE_ARTIFACTS, ARTIFACTS, SERVERS, FORCE_LOGGER, SNACKBAR, IN_PROGRESS, ADD_SERVER, REMOVE_SERVER} from './actions';

const defaultState = {
  artifacts: [],
  servers: [],
  versions: [],
  inProgress: {},
  snackbar: false
};

export function actionReducers(state = defaultState, action) {
  let clone;
  switch (action.type) {
    case UPDATE_HISTORY:
      clone = Object.assign({}, state);
      const filter = state.versions.filter(v => v.name !== action.version.name)
      if (action.version.f) {
        filter.push(action.version);
      }
      clone.versions = filter;
      return clone;
    case SNACKBAR:
      clone = Object.assign({}, state);
      clone.snackbar = action.val;
      return clone;
    case IN_PROGRESS:
      const oldActive = state.inProgress.active;
      const stat = action.stat || {};
      clone = Object.assign({}, state);
      clone.inProgress = stat;
      if (!stat.active && oldActive) {
        clone.snackbar = true;
      }
      return clone;
    case ARTIFACTS:
      const updated = action.artifacts || [];
      clone = Object.assign({}, state);
      clone.artifacts = updated;
      return clone;
    case SERVERS:
      const updatedServer = action.servers || [];
      clone = Object.assign({}, state);
      clone.servers = updatedServer;
      return clone;
    case FORCE_LOGGER:
      clone = Object.assign({}, state);
      clone.forceLogger = action.val;
      return clone;
    case ADD_ARTIFACTS:
      if (!action.artifacts || action.artifacts.length === 0) {
        return state;
      }
      clone = Object.assign({}, state);
      action.artifacts.forEach(n => clone.artifacts.push(n));
      return clone;
    case ADD_SERVER:
      if (!action.server) {
        return state;
      }
      clone = Object.assign({}, state);
      clone.servers.push(action.server);
      return clone;
    case REMOVE_SERVER:
      if (!action.server) {
        return state;
      }
      clone = Object.assign({}, state);
      clone.servers = state.servers.filter(s => s.host !== action.server.host);
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
}
