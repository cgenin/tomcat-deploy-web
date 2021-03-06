import fetch from 'isomorphic-fetch';
export const DELETE = 'ARTIFACTS:DELETE';
export const UPDATE = 'ARTIFACTS:UPDATE';

export function clean(nb) {
  return () => fetch(`/api/artifact/last/${nb}`, {
    method: 'delete',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(res => res.json());
}

export function save(artifact) {
  const body = JSON.stringify(artifact);
  return () => fetch('/api/artifact', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }, body
  }).then(res => res.json());
}

export function del(artifact) {
  const body = JSON.stringify(artifact);
  return dispatch => fetch('/api/artifact', {
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
  return dispatch => fetch('/api/artifact')
    .then(res => res.json())
    .then(json => dispatch(update(json)));
}

export function update(artifacts) {
  return {
    type: UPDATE,
    artifacts
  };
}
