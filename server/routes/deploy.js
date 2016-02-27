const deploydb = require('../deploydb');
const inProgress = require('../in-progress');
const backup = require('../backup');
const remoteConsole = function (io) {
  return {
    error: function (msg) {
      io.sockets.emit('rc-error', msg);
    },
    log: function (msg) {
      io.sockets.emit('rc-log', msg);
    },
    end: function () {
      io.sockets.emit('rc-end', {});
    },
    start: function () {
      io.sockets.emit('rc-start', {});
    }
  };
};


module.exports = function (socket, io, ip) {
  const war = require('../war');
  const rc = remoteConsole(io);
  const emitInProgress = function () {
    io.sockets.emit(inProgress.event, {active: inProgress.isActive(), ip});
  };
  rc.log('connected to server.');


  const data = backup.data();
  socket.emit('versions', data);
  socket.on('artifact-clean', (nb) => io.sockets.emit('versions', backup.clean(nb)));

  socket.on('undeploy', (data) => {
    inProgress.active();
    emitInProgress();
    const recursiveUndeploy = function (artifacts) {
      if (!artifacts || artifacts.length === 0) {
        rc.end();
        inProgress.disable();
        emitInProgress();
        return;
      }

      try {
        const last = artifacts.slice(-1)[0];
        const rest = artifacts.slice(0, -1);
        rc.log(`undeploy : ${last.name}`);
        war.undeploy(data.server, last).then((name) => {
          rc.log(`undeployed : ${name}`);
          recursiveUndeploy(rest);
        }, (err) => {
          console.error(err);
          rc.error('error in undeploying');
          rc.error(err.message);
          recursiveUndeploy(rest);
        });
      } catch (err) {
        console.error(err);
        if (err.stack) {
          console.error(err.stack);
        }
        rc.error('Exception in deployement');
        rc.error(err.message);
        rc.end();
        inProgress.disable();
        emitInProgress();
      }
    };
    recursiveUndeploy(data.artifacts);
  });

  socket.on('deploy', (data) => {
      inProgress.active();
      emitInProgress();
      const errorLogger = function (msg, o) {
        return function (err) {
          if (o) {
            socket.emit('replace-item', deploydb.updateStatus(deploydb.files(), o, 'KO'));
          }
          io.sockets.emit('deploy-end', {});
          rc.error(msg);
          rc.error(err.message);
          rc.end();
          inProgress.disable();
          emitInProgress();
        };
      };
      const versions = data.versions;
      const configuration = data.server;
      const launchInner = (array) => {
        if (!array || array.length === 0) {
          rc.end();
          inProgress.disable();
          emitInProgress();
          return;
        }
        const o = array.shift();
        const v = versions.find(v => v.name === o.name);
        if (v) {
          rc.log(`prepare to rollback : ${o.name}`);
          war.rollback(configuration, o, v).then(() => {
            rc.log(`rollbacked : ${o.name}`);
            socket.emit('replace-item', deploydb.updateStatus(deploydb.files(), o, 'OK'));
            backup.load(o.name).then((d) => io.sockets.emit('versions', d));
            io.sockets.emit('deploy-end', {});
            launchInner(array);
          }, errorLogger('error in rollback', o));
        } else {
          rc.log(`managing old version : ${o.name}`);
          war.managedOld(o).then(
            () => {
              rc.log(`prepare download : ${o.name}`);
              war.download(o).then(
                (name) => {
                  rc.log(`deploy : ${name}`);
                  war.undeploy(configuration, o).then(() => {
                    rc.log(`Undeployed : ${name}`);

                    war.deploy(configuration, o).then(
                      (wname) => {
                        rc.log(`Updated : ${wname}`);
                        socket.emit('replace-item', deploydb.updateStatus(deploydb.files(), o, 'OK'));
                        backup.load(o.name).then((d) => io.sockets.emit('versions', d));
                        io.sockets.emit('deploy-end', {});
                        launchInner(array);
                      }, errorLogger('error in deploying', o));
                  }, errorLogger('error in undeploying', o));
                }, errorLogger('error in downloading', o));
            }, errorLogger('error in managing old war', o));
        }
      };
      io.sockets.emit('deploy-start', {type: 'Deploy', host: ip});
      rc.start();

      rc.log(`selected wars : ${data.length} by ${ip}`);
      war.makedirectory().then(() => {
        rc.log('root directory : OK.');
        launchInner(data.artifacts);
      });
    }
  );
};
