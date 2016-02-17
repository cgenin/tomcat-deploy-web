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
    dispatch(inprogress(`http://${host}/manager/text/list`));
    fetch(`api/server/auth?host=${encodeURIComponent(host)}&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
      method: 'get',
      headers: {
        'Accept': 'text/plain;charset=utf-8'
      }
    }).then(res => res.json()).catch(ex => {
      console.error(ex);
      dispatch(failed(0));
    }).then(json => {
      if (json.status === 200) {
        dispatch(success(json.body));
      } else {
        dispatch(failed(json.status));
      }
    });
  };
}