import fetch from 'isomorphic-fetch';

export const UPDATE = 'SCHEDULERS:UPDATE';
export const DELETE = 'SCHEDULERS:UPDATE';

function update(schedulers) {
  return {
    type: UPDATE,
    schedulers
  }
}

export function load() {
  return (dispatch) => {
    return fetch('/api/scheduler')
      .then(res => res.json())
      .then(list => dispatch(update(list)));
  }
}

export function add(scheduler) {
  const body = JSON.stringify(scheduler);
  return (dispatch) => {
    return fetch('/api/scheduler', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }, body
    })
      .then(res => res.json())
      .then(list => dispatch(update(list)));
  }
}
