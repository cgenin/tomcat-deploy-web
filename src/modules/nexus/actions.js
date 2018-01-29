import fetch from 'isomorphic-fetch';

export const RESET = 'NEXUS:RESET';
export const REMOVE = 'NEXUS:REMOVE';
export const ADD = 'NEXUS:ADD';

export function add(nexus) {
  return {
    type: ADD, nexus
  };
}

export function remove(nexus) {
  return {
    type: REMOVE, nexus
  };
}

export function reset() {
  return dispatch => new Promise((resolve) => {
    dispatch({type: RESET});
    resolve(true);
  });
}


export function testArtifact(groupId, artifactId) {
  return () => fetch(`/api/nexus/artifact?&g=${groupId}&a=${artifactId}`, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(res => {
    const statusCode = res.status;
    return res.json().then(body => {
      return Promise.resolve({statusCode, body});
    });
  });
}


