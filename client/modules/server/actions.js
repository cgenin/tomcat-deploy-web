import fetch from 'isomorphic-fetch';

export const UPDATE = 'SEVER:UPDATE';
export const ADD = 'SEVER:ADD';

function add(server) {
  return {
    type: ADD, server
  };
}

function update(servers) {
  return {
    type: UPDATE, servers
  };
}


export function save(server) {
  const body = JSON.stringify(server);
  return dispatch => fetch('api/server', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }, body
  }).then(res => res.json()).then(json => {
    dispatch(add(json));
    return new Promise((resolve) => resolve(true));
  });
}

export function del(server) {
  const body = JSON.stringify(server);
  return dispatch => fetch('api/server', {
    method: 'delete',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }, body
  }).then(res => res.json()).then(json => {
    dispatch(update(json));
  });
}

export function load() {
  return dispatch => fetch('api/server').then(res => res.json()).then(json => dispatch(update(json)));
}
