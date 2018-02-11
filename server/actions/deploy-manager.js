const history = require('../history');
const logger = require('../logger');
const war = require('./war-manager');
const inProgresss = require('./in-progress');
const rc = require('../ws/RemoteConsole');
const {copy} = require('./nexus');
const Rx = require('rxjs/Rx');

class DeployManager {

  constructor(ip) {
    this.ip = ip;
  }

  undeploy(server, artifacts) {
    return new Promise((resolve, reject) => {
      inProgresss.schedule(() => {
        rc.startUndeploy(server, this.ip);
        Rx.Observable.from(artifacts)
          .flatMap((last) => {
            rc.log(`undeploy : ${last.name}`);
            return war.undeploy(server, last)
          })
          .subscribe(
            (name) => {
              rc.log(`undeployed : ${name}`);
            },
            (err) => {
              logger.error(err);
              rc.error('error in undeploying');
              if (err.stack) {
                logger.error(err.stack);
              }
              rc.error(err.message);
              rc.endDeploy(this.ip);
              reject(false);
            },
            () => {
              rc.endDeploy(this.ip);
              resolve(true);
            });
      });
    });
  }


  deployByNexus(server, nexus) {
    return new Promise((resolve, reject) => {
      inProgresss.schedule(() => {
        rc.startDeploy(server, nexus, this.ip);
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
              rc.deployEnd();
            },
            (err) => {
              rc.deployEnd();
              rc.error(err.message);
              if (err.stack) {
                logger.error(err.stack);
              }
              logger.error(err);
              rc.endDeploy(this.ip);
              reject(false)
            },
            () => {
              rc.endDeploy(this.ip);
              resolve(true);
            });
      });
    });
  }


  deployByUrl(server, artifacts, versions = []) {
    return Rx.Observable.create((observer) => {
      inProgresss.schedule(() => {
        rc.startDeploy(server, artifacts, this.ip);
        war.makeDirectory()
          .flatMap(() => {
            rc.log('root directory : OK.');
            const obs = artifacts.map(
              o => {
                const v = versions.find(v => v.name === o.name);
                const job = o.job || o.name;
                return Rx.Observable.if(
                  () => v,
                  // rollback old version
                  Rx.Observable.of(o)
                    .flatMap(obj => {
                      rc.log(`prepare to rollback : ${job}`);
                      return war.rollback(server, obj, v)
                    })
                    .map(() => {
                      rc.log(`rollbacked : ${job}`);
                      return o;
                    }),
                  // deploy artifact
                  Rx.Observable.of(o)
                    .flatMap(() => {
                      rc.log(`managing old version : ${o.name}`);
                      return war.managedOld(o)
                    })
                    .flatMap(() => {
                      rc.log(`prepare download : ${job}`);
                      return war.download(o);
                    })
                    .flatMap((name) => {
                      rc.log(`undeploy : ${name}`);
                      return war.undeploy(server, o)
                    })
                    .flatMap(() => {
                      rc.log(`deploy : ${job}`);
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
              rc.deployEnd();
              observer.next(o);
            },
            (err) => {
              rc.deployEnd();
              rc.error(err.message);
              logger.error(err.message);
              if (err.stack) {
                logger.error(err.stack);
              }
              logger.error(err);
              rc.endDeploy(this.ip);
              observer.error(err);
            },
            () => {
              rc.endDeploy(this.ip);
              observer.complete();
            });
      });
    });
  };
}

module.exports = DeployManager;
