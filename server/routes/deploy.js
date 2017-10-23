const deploydb = require('../deploydb');
const inProgress = require('../in-progress');
const backup = require('../backup');
const Rx = require('rxjs/Rx');

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
    io.sockets.emit('deploiement-in-progress', {active: inProgress.isActive(), ip});
  };
  rc.log('connected to server.');


  socket.emit('versions', backup.data());
  socket.on('artifact-clean', (nb) => io.sockets.emit('versions', backup.clean(nb)));

  socket.on('undeploy', (data) => {
    inProgress.active();
    emitInProgress();
    // const recursiveUndeploy = function (artifacts) {
    //   if (!artifacts || artifacts.length === 0) {
    //     rc.end();
    //     inProgress.disable();
    //     emitInProgress();
    //     return;
    //   }
    //
    //   try {
    //     const last = artifacts.slice(-1)[0];
    //     const rest = artifacts.slice(0, -1);
    //     rc.log(`undeploy : ${last.name}`);
    //     war.undeploy(data.server, last).then((name) => {
    //       rc.log(`undeployed : ${name}`);
    //       recursiveUndeploy(rest);
    //     }, (err) => {
    //       console.error(err);
    //       rc.error('error in undeploying');
    //       rc.error(err.message);
    //       recursiveUndeploy(rest);
    //     });
    //   } catch (err) {
    //     console.error(err);
    //     if (err.stack) {
    //       console.error(err.stack);
    //     }
    //     rc.error('Exception in deployement');
    //     rc.error(err.message);
    //     rc.end();
    //     inProgress.disable();
    //     emitInProgress();
    //   }
    // };
    rc.log(`target server : ${data.server.host}`);
    //recursiveUndeploy(data.artifacts);
    Rx.Observable.from(data.artifacts)
      .flatMap((last) => {
        rc.log(`undeploy : ${last.name}`);
        return war.undeploy(data.server, last)
      })
      .subscribe(
        (name) => {
          rc.log(`undeployed : ${name}`);
        },
        (err) => {
          console.error(err);
          rc.error('error in undeploying');
          if (err.stack) {
            console.error(err.stack);
          }
          rc.error(err.message);
          rc.end();
          inProgress.disable();
          emitInProgress();
        },
        () => {
          rc.end();
          inProgress.disable();
          emitInProgress();
        });

  });

  socket.on('deploy', (data) => {
      inProgress.active();
      emitInProgress();
      const versions = data.versions;
      const configuration = data.server;
      // const errorLogger = function (msg, o) {
      //   return function (err) {
      //     if (o) {
      //       socket.emit('replace-item', deploydb.updateStatus(deploydb.files(), o, 'KO', configuration.host));
      //     }
      //     io.sockets.emit('deploy-end', {});
      //     rc.error(msg);
      //     rc.error(err.message);
      //     rc.end();
      //     inProgress.disable();
      //     emitInProgress();
      //   };
      // };
      //
      //
      // const launchInner = (array) => {
      //   if (!array || array.length === 0) {
      //     rc.end();
      //     inProgress.disable();
      //     emitInProgress();
      //     return;
      //   }
      //   const o = array.shift();
      //   const v = versions.find(v => v.name === o.name);
      //   if (v) {
      //     rc.log(`prepare to rollback : ${o.name}`);
      //     war.rollback(configuration, o, v).then(() => {
      //       rc.log(`rollbacked : ${o.name}`);
      //       socket.emit('replace-item', deploydb.updateStatus(deploydb.files(), o, 'OK', configuration.host));
      //       backup.load(o.name).then((d) => io.sockets.emit('versions', d));
      //       io.sockets.emit('deploy-end', {});
      //       launchInner(array);
      //     }, errorLogger('error in rollback', o));
      //   } else {
      //     rc.log(`managing old version : ${o.name}`);
      //     war.managedOld(o).then(
      //       () => {
      //         rc.log(`prepare download : ${o.name}`);
      //         war.download(o).then(
      //           (name) => {
      //             rc.log(`deploy : ${name}`);
      //             war.undeploy(configuration, o).then(() => {
      //               rc.log(`Undeployed : ${name}`);
      //
      //               war.deploy(configuration, o).then(
      //                 (wname) => {
      //                   rc.log(`Updated : ${wname}`);
      //                   socket.emit('replace-item', deploydb.updateStatus(deploydb.files(), o, 'OK', configuration.host));
      //                   backup.load(o.name).then((d) => io.sockets.emit('versions', d));
      //                   io.sockets.emit('deploy-end', {});
      //                   launchInner(array);
      //                 }, errorLogger('error in deploying', o));
      //             }, errorLogger('error in undeploying', o));
      //           }, errorLogger('error in downloading', o));
      //       }, errorLogger('error in managing old war', o));
      //   }
      // };
      io.sockets.emit('deploy-start', {type: 'Deploy', host: ip});
      rc.start();
      rc.log(`target server : ${configuration.host}`);
      console.log(data)
      rc.log(`selected wars : ${data.length} by ${ip}`);
      war.makeDirectory()
        .flatMap(() => {
          rc.log('root directory : OK.');
          const obs = data.artifacts.map(
            o => {
              const v = versions.find(v => v.name === o.name);
              return Rx.Observable.if(
                () => v,
                // rollback old version
                Rx.Observable.of(o)
                  .flatMap(obj => {
                    rc.log(`prepare to rollback : ${obj.name}`);
                    return war.rollback(configuration, obj, v)
                  })
                  .map(() => {
                    rc.log(`rollbacked : ${o.name}`);
                    return o;
                  }),
                // deploy arifact
                Rx.Observable.of(o)
                  .flatMap(() => {
                    rc.log(`managing old version : ${o.name}`);
                    return war.managedOld(o)
                  })
                  .flatMap(() => {
                    rc.log(`prepare download : ${o.name}`);
                    return war.download(o);
                  })
                  .flatMap((name) => {
                    rc.log(`undeploy : ${name}`);
                    return war.undeploy(configuration, o)
                  })
                  .flatMap(() => {
                    rc.log(`deploy : ${o.name}`);
                    return war.deploy(configuration, o)
                  })
                  .map((wname) => {
                    rc.log(`Updated : ${wname}`);
                    return o;
                  })
              );
            }
          );
          return Rx.Observable.concat(...obs);
        })
        .subscribe(
          (o) => {
            socket.emit('replace-item', deploydb.updateStatus(deploydb.files(), o, 'OK', configuration.host));
            backup.load(o.name).then((d) => io.sockets.emit('versions', d));
            io.sockets.emit('deploy-end', {});
          },
          (err) => {
            io.sockets.emit('deploy-end', {});
            rc.error(err.message);
            if (err.stack) {
              console.error(err.stack);
            }
            console.error(err);
            rc.end();
            inProgress.disable();
            emitInProgress();
          },
          () => {
            rc.end();
            inProgress.disable();
            emitInProgress();
          });
    }
  );
};
