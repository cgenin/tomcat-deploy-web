import {end, error, log, start} from './modules/logger/actions';
import {progress, showSnackbar} from './modules/actions/actions';
import {update} from './modules/versions/actions';
import io from 'socket.io-client';

export const socket = io();

export function initialize(dispatch) {
  socket.on('rc-log', (msg) => dispatch(log(msg)));
  socket.on('rc-error', (msg) => dispatch(error(msg)));
  socket.on('rc-end', () => dispatch(end()));
  socket.on('rc-start', () => dispatch(start()));
  socket.on('deploiement-in-progress', (data) => {
    dispatch(progress(data));
  });
  socket.on('versions', (data) => setTimeout(() => dispatch(update(data)), 50));
  socket.on('snackbar', () => dispatch(showSnackbar()));
}
