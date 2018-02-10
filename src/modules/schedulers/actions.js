import fetch from 'isomorphic-fetch';

export const UPDATE = 'SCHEDULERS:UPDATE';
export const DELETE = 'SCHEDULERS:DELETE';

function update(schedulers) {
  return {
    type: UPDATE,
    schedulers
  }
}

export function test(cron) {
  return fetch(`/api/scheduler/${cron}/validate`)
    .then(res => res.json());
}

export function load() {
  return (dispatch) => {
    return fetch('/api/scheduler')
      .then(res => res.json())
      .then(list => {
        dispatch(update(list))
      });
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

export function start(scheduler) {
  return (dispatch) => {
    return fetch(`/api/scheduler/${scheduler.$loki}/run`, {
      method: 'put',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(list => dispatch(update(list)));
  }
}

export function stop(scheduler) {
  return (dispatch) => {
    return fetch(`/api/scheduler/${scheduler.$loki}/run`, {
      method: 'delete',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(list => dispatch(update(list)));
  }
}


export function remove(scheduler) {
  return (dispatch) => {
    return fetch(`/api/scheduler/${scheduler.$loki}`, {
      method: 'delete',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(list => dispatch(update(list)));
  }
}
