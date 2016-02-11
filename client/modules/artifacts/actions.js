import fetch from 'isomorphic-fetch';
import { routeActions } from 'react-router-redux';
export const DELETE = 'ARTIFACTS:DELETE';
export const UPDATE = 'ARTIFACTS:UPDATE';


export function save(name, url) {
  const body = JSON.stringify({
    name,
    url
  });
  return dispatch => {
    return fetch('api/artifact', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }, body
    }).then(res => res.json()).then(json => {
      //dispatch(update(json));
      dispatch(routeActions.push('/'));
    });
  };
}

export function del(artifact) {
  const body = JSON.stringify(artifact);
  return dispatch => {
    return fetch('api/artifact', {
      method: 'delete',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }, body
    }).then(res => res.json()).then(json => {
      dispatch(update(json));
    });
  };
}

export function load() {
  return dispatch => {
    return fetch('api/artifact').then(res => res.json()).then(json => dispatch(update(json)));
  };
}

export function update(artifacts) {
  return {
    type: UPDATE,
    artifacts
  };
}