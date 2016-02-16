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

function inprogress(url) {
  return {
    type: INPROGRESS, url
  };
}

export function testServer(host, username, password) {
  return dispatch => {
    const url = `http://${host}/manager/text/list`;
    dispatch(inprogress(url));
    const encodedString = btoa(`${username}:${password}`);
    fetch(url, {
      mode: 'no-cors',
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
        console.error(res);
        dispatch(failed(res.text()));
      }
    }).catch(ex => {
      console.error(ex);
      dispatch(failed(0));
    });
  };
}