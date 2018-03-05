import fetch from 'isomorphic-fetch';

export const UPDATE = 'HISTORYLOG:UPDATE';
export const LOADING = 'HISTORYLOG:LOADING';

function loading() {
  return {
    type: LOADING,
  };
}

export function update(result) {
  return {
    type: UPDATE,
    result
  };
}

export function load() {
  return (dispatch) => {
    dispatch(loading());
    fetch('/api/log')
      .then(res => res.json())
      .then(arr => dispatch(update(arr)));
  };
}
