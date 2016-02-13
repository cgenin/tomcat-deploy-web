import {end, error, log, start} from './modules/logger/actions';
export const socket = io();

export function initialize(dispatch) {
  socket.on('rc-log', (msg) => dispatch(log(msg)));
  socket.on('rc-error', (msg) => dispatch(error(msg)));
  socket.on('rc-end', () => dispatch(end()));
  socket.on('rc-start', () => dispatch(start()));
  /* socket.on('deploy-start', function (data) {
   home.set('deploiementInProgress', data);
   });
   socket.on('deploy-end', function (data) {
   console.log(data);
   home.set('deploiementInProgress', {});
   });*/
}
