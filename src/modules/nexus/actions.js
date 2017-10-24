import fetch from 'isomorphic-fetch';

export const UPDATE = 'NEXUS:UPDATE';
export const ADD = 'NEXUS:ADD';

function add(nexus) {
  return {
    type: ADD, nexus
  };
}

function update(nexus) {
  return {
    type: UPDATE, nexus
  };
}


export function save(server) {
  const body = JSON.stringify(server);
  console.log(server);
  return dispatch => fetch('/api/nexus', {
    method: 'put',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }, body
  }).then(res => res.json()).then(json => {
    dispatch(add(json));
    return new Promise((resolve) => resolve(true));
  });
}


export function load() {
  return dispatch => fetch('/api/nexus').then(res => res.json()).then(json => {
    dispatch(update(json));
    return new Promise((resolve) => resolve(json));
  });
}

export function test(host, port, context) {
  return () => fetch(`/api/nexus/test?host=${host}&port=${port}&context=${context}`, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(res => res.json());
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

export function search(host, port, q) {
  return () => fetch(`/api/nexus/artifact/search?host=${host}&port=${port}&q=${q}`, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(res => res.json());
}


