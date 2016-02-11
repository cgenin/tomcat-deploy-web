export const SEND = 'MESSAGE:SEND';
export const HIDE = 'MESSAGE:HIDE';
export const TYPE_SUCCESS = 'SUCCESS';
export const TYPE_ERROR = 'ERROR';

export function hide() {
  return {
    type: HIDE
  };
}

export function send(type, text) {
  return {
    type: SEND,
    content: {
      type, text
    }
  };
}