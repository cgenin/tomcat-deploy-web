import fetch from 'isomorphic-fetch';

export const UPDATE = 'HISTORY:UPDATE';
export const LOADING = 'HISTORY:LOADING';

function loading() {
  return {
    type: LOADING,
  };
}

export function update(arr) {
  return {
    type: UPDATE,
    arr
  };
}

export function load() {
  return (dispatch) => {
    dispatch(loading());
    fetch('/api/history')
      .then(res => res.json())
      .then(arr => dispatch(update(arr)));
  };
}
