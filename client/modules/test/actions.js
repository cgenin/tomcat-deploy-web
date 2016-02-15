import fetch from 'isomorphic-fetch';

export const FAILED = 'TEST:FAILED';
export const SUCCESS = 'TEST:SUCCESS';
export const INPROGRESS = 'TEST:INPROGRESS';

function success(data) {
  return {
    type: SUCCESS, data
  };
}

function failed(code) {
  return {
    type: FAILED, code
  };
}

function inprogress() {
  return {
    type: INPROGRESS
  };
}

export function testServer(host, username, password) {
  return dispatch => {
    dispatch(inprogress());
    const encodedString = btoa(`${username}:${password}`);
    fetch(`http://${host}/manager/text/list`, {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encodedString}`
      }
    }).then(res => {
      if (res.status >= 200 && res.status < 300) {
        dispatch(success(res.text()));
      } else {
        dispatch(failed(res.text()));
      }
    }).catch(ex => {
      console.log('parsing failed', ex);
      dispatch(failed(0));
    });
  };
}