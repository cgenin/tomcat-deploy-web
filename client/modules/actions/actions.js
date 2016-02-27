import {socket} from '../../socket';

export const ADD_ARTIFACTS = 'ACTIONS:ADD-ARTIFACTS';
export const REMOVE_ARTIFACTS = 'ACTIONS:REMOVE-ARTIFACTS';
export const ARTIFACTS = 'ACTIONS:ARTIFACTS';
export const SERVERS = 'ACTIONS:SERVERS';
export const ADD_SERVER = 'ACTIONS:ADD-SERVER';
export const REMOVE_SERVER = 'ACTIONS:REMOVE-SERVER';
export const FORCE_LOGGER = 'ACTIONS:FORCE_LOGGER';
export const SNACKBAR = 'ACTIONS:SNACKBAR';
export const IN_PROGRESS = 'ACTIONS:IN_PROGRESS';
export const UPDATE_HISTORY = 'ACTIONS:UPDATE_HISTORY';

export function updateHistory(version) {
  return {
    type: UPDATE_HISTORY, version
  };
}

export function hideConsole() {
  return {
    type: FORCE_LOGGER, val: false
  };
}

export function hideSnackbar() {
  return {
    type: SNACKBAR, val: false
  };
}

export function showSnackbar() {
  return {
    type: SNACKBAR, val: true
  };
}

export function progress(stat) {
  return {
    type: IN_PROGRESS, stat
  };
}

export function deploy(server, artifacts, versions) {
  socket.emit('deploy', {server, artifacts, versions});
  return {
    type: FORCE_LOGGER, val: true
  };
}

export function undeploy(server, artifacts) {
  socket.emit('undeploy', {server, artifacts});
  return {
    type: FORCE_LOGGER, val: true
  };
}

export function updateArtifacts(artifacts) {
  return {
    type: ARTIFACTS,
    artifacts
  };
}

export function updateServers(servers) {
  return {
    type: SERVERS,
    servers
  };
}

export function addArtifacts(artifacts) {
  return {
    type: ADD_ARTIFACTS,
    artifacts
  };
}

export function removeArtifacts(artifacts) {
  return {
    type: REMOVE_ARTIFACTS, artifacts
  };
}

export function addServer(server) {
  return {
    type: ADD_SERVER,
    server
  };
}

export function removeServer(server) {
  return {
    type: REMOVE_SERVER, server
  };
}