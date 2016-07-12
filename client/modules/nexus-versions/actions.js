export const UPDATE = 'NEXUSVERSIONS:UPDATE';

function update(data) {
  return {
    type: UPDATE, data
  };
}


export function reload() {
  return dispatch => fetch(`/api/nexus/artifact/versions`, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(res => res.json()).then(j => {
    dispatch(update(j));
    return new Promise((resolve) => resolve(true));
  });
}
