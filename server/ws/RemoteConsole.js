const inProgress = require('../actions/in-progress');

let instance = null;

class RemoteConsole {

  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;
    this.io = {
      sockets: {
        emit(type, msg) {
          console.log(`Null Io : ${type}:'${msg}'`);
        }
      }
    };
  }

  startUndeploy(server, ip){
    inProgress.active();
    this.emitInProgress(ip);
    this.log(`target server : ${server.host}`);
  }

  startDeploy(server, data, ip) {
    inProgress.active();
    this.emitInProgress(ip);
    this.deployStart(ip);
    this.start();
    this.log(`target server : ${server.host}`);
    this.log(`selected wars : ${data.length} by ${ip}`);
  }

  endDeploy(ip) {
    this.end();
    inProgress.disable();
    this.emitInProgress(ip);
  };

  setIo(io) {
    this.io = io;
    return this;
  }

  emitInProgress(ip) {
    this.io.sockets.emit('deploiement-in-progress', {active: inProgress.isActive(), ip});
  }

  deployStart(ip) {
    this.io.sockets.emit('deploy-start', {type: 'Deploy', host: ip});
  }

  deployEnd() {
    this.io.sockets.emit('deploy-end', {});
  }

  error(msg) {
    this.io.sockets.emit('rc-error', msg);
  }

  log(msg) {
    this.io.sockets.emit('rc-log', msg);
  }

  end() {
    this.io.sockets.emit('rc-end', {});
  }

  start() {
    this.io.sockets.emit('rc-start', {});
  }
}

module.exports = new RemoteConsole();
