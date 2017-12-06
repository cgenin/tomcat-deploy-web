const deploydb = require('../deploydb');
const inProgress = require('../in-progress');
const backup = require('../backup');
const history = require('../history');
const {copy} = require('../nexus');

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
  const war = require('../war-manager');
  const rc = remoteConsole(io);
  const emitInProgress = function () {
    io.sockets.emit('deploiement-in-progress', {active: inProgress.isActive(), ip});
  };
  rc.log('connected to server.');

  const startDeploy = (server, data) => {
    inProgress.active();
    emitInProgress();
    io.sockets.emit('deploy-start', {type: 'Deploy', host: ip});
    rc.start();
    rc.log(`target server : ${server.host}`);
    rc.log(`selected wars : ${data.length} by ${ip}`);
  };


  const endDeploy = () => {
    rc.end();
    inProgress.disable();
    emitInProgress();
  };


  socket.emit('versions', backup.data());
  socket.on('artifact-clean', (nb) => backup.clean(nb).subscribe(v => io.sockets.emit('versions', v)));

  socket.on('undeploy', (data) => {
    inProgress.active();
    emitInProgress();
    rc.log(`target server : ${data.server.host}`);
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


  socket.on('deploy-nexus', (data) => {
    const {nexus, server} = data;
    startDeploy(server, nexus);
    war.makeNexusDirectory()
      .flatMap((root) => {
        rc.log('root directory : OK.');
        const obs = nexus.map(artifact => {
          const {artifactId, groupId, packaging, version, name} = artifact;
          return Rx.Observable.of(artifact)
            .flatMap(() => {
              let str = JSON.stringify(artifact);
              rc.log(`prepare to deploy from nexus : ${str}`);
              return copy(groupId, artifactId, root, packaging, version);
            })
            .flatMap((warPath) => {
              rc.log(`Download in : ${warPath}`);
              rc.log(`undeploy : ${artifactId}`);
              return war.undeploy(server, artifactId)
                .flatMap(() => {
                  rc.log(`deploy : ${name}`);
                  return war.deploySync(server, name, warPath);
                });
            }).map(
              () => {
                rc.log(`End deploy`);
                return artifact;
              }
            ).do(null, () => {
              history.update(server, new Date(), artifact.name, 'KO', {type: 'nexus', version: artifact.version});
            });
        });
        return Rx.Observable.concat(...obs);
      })
      .subscribe(
        (o) => {
          history.update(server, new Date(), o.name, 'OK', {type: 'nexus', version: o.version});
          io.sockets.emit('deploy-end', {});
        },
        (err) => {
          io.sockets.emit('deploy-end', {});
          rc.error(err.message);
          if (err.stack) {
            console.error(err.stack);
          }
          console.error(err);
          endDeploy();
        },
        () => {
          endDeploy()
        });
  });

  socket.on('deploy', (data) => {
      const {versions, server} = data;
      startDeploy(server, data.artifacts);
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
                    return war.rollback(server, obj, v)
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
                    return war.undeploy(server, o)
                  })
                  .flatMap(() => {
                    rc.log(`deploy : ${o.name}`);
                    return war.deploy(server, o)
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
            history.update(server, new Date(), o.name, 'OK', {type: 'jenkins'});
            socket.emit('replace-item', deploydb.updateStatus(deploydb.files(), o, 'OK', server.host));
            backup.load(o.name).subscribe((d) => io.sockets.emit('versions', d));
            io.sockets.emit('deploy-end', {});
          },
          (err) => {
            io.sockets.emit('deploy-end', {});
            rc.error(err.message);
            if (err.stack) {
              console.error(err.stack);
            }
            console.error(err);
            endDeploy()
          },
          () => {
            endDeploy()
          });
    }
  );
};
