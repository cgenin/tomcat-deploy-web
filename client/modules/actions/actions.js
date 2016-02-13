import {socket} from '../../socket';

export const ADD_ARTIFACTS = 'ACTIONS:ADD-ARTIFACTS';
export const REMOVE_ARTIFACTS = 'ACTIONS:REMOVE-ARTIFACTS';
export const ARTIFACTS = 'ACTIONS:ARTIFACTS';
export const SERVERS = 'ACTIONS:SERVERS';
export const ADD_SERVER = 'ACTIONS:ADD-ARTIFACTS';
export const REMOVE_SERVER = 'ACTIONS:REMOVE-ARTIFACTS';
export const FORCE_LOGGER = 'ACTIONS:FORCE_LOGGER';

export function hideConsole() {
  return {
    type: FORCE_LOGGER, val: false
  };
}

export function deploy(server, artifacts) {
  socket.emit('deploy', {server, artifacts});
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