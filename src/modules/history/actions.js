import fetch from 'isomorphic-fetch';

export const UPDATE = 'HISTORY:UPDATE';

export function update(arr) {
  return {
    type: UPDATE,
    arr
  };
}

export function load() {
  return (dispatch) => {
    fetch('/api/history')
      .then(res => res.json())
      .then(arr => dispatch(update(arr)));
  };
}
