import {end, error, log, start} from './modules/logger/actions';
import {progress} from './modules/actions/actions';

export const socket = io();

export function initialize(dispatch) {
  socket.on('rc-log', (msg) => dispatch(log(msg)));
  socket.on('rc-error', (msg) => dispatch(error(msg)));
  socket.on('rc-end', () => dispatch(end()));
  socket.on('rc-start', () => dispatch(start()));
  socket.on('deploiement-in-progress', (data) => {
    dispatch(progress(data));
  });
  /*
   socket.on('deploy-end', function (data) {
   console.log(data);
   home.set('deploiementInProgress', {});
   });*/
}
