export const LOG = 'LOGGER:LOG';
export const ERROR = 'LOGGER:ERROR';
export const START = 'LOGGER:START';
export const END = 'LOGGER:END';
export const CLEAR = 'LOGGER:CLEAR';


export function log(msg) {
  return {
    type: LOG,
    msg
  };
}

export function error(msg) {
  return {
    type: ERROR,
    msg
  };
}

export function start() {
  return {
    type: START
  };
}

export function end() {
  return {
    type: END
  };
}


export function clear() {
  return {
    type: CLEAR
  };
}