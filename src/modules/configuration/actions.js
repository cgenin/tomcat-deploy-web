import fetch from "isomorphic-fetch";

export const LOAD_CONFIGURATION = 'CONFIGURATION:LOAD';

export function update(configuration) {
  return {
    type: LOAD_CONFIGURATION,
    configuration
  };
}

export function load() {
  return dispatch => fetch('/api/configuration')
    .then(res => res.json())
    .then(json => dispatch(update(json)));
}


export function save(configuration) {
  const body = JSON.stringify(configuration);
  return dispatch => fetch('/api/configuration', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body
  }).then(() => dispatch(update(configuration)));
}
