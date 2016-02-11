import fetch from 'isomorphic-fetch';

export const UPDATE = 'SEVER:UPDATE';


function update(server) {
  return {
    type: UPDATE,
    server: server
  };
}

export function save(server) {
  const body = JSON.stringify(server);
  return dispatch => {
    return fetch('api/artifact', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, body
    }).then(res => res.json()).then(json => {
      dispatch(update(json));
    });
  };
}

export function load() {
  return dispatch => {
    return fetch('api/server').then(res=>res.json()).then(json => dispatch(update(json)));
  };
}
