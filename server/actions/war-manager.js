const http = require('http');
const fs = require('fs');
const URL = require('url');
const Rx = require('rxjs/Rx');
const config = require('../config');
const logger = require('../logger');
const rimraf = require('rimraf');
const downloadedDir = config.downloadedDir;

const warname = function (name) {
  return `${name}.war`;
};


const fullpath = function (name) {
  return `${downloadedDir}/${warname(name)}`;
};

const host = function (configuration) {
  return `http://${configuration.host}`;
};

class WarManager {


  makeDirectory() {
    const stat = Rx.Observable.bindNodeCallback(fs.stat);
    return stat(downloadedDir)
      .flatMap((exist) => {
        if (exist) {
          return Rx.Observable.of(downloadedDir);
        }
        return Rx.Observable.bindNodeCallback(fs.mkdir)(downloadedDir)
          .map(() => downloadedDir);
      });
  }

  makeNexusDirectory() {
    const nexusDir = `${downloadedDir}/download`;
    const mkdir = Rx.Observable.bindNodeCallback(fs.mkdir);
    try {
      const exist = fs.statSync(nexusDir);
      if (exist) {
        return Rx.Observable.bindNodeCallback(rimraf)(nexusDir)
          .flatMap(() => mkdir(nexusDir))
          .map(() => nexusDir);
      }
    }
    catch (err) {
      logger.warn(err);
    }
    return mkdir(nexusDir)
      .map(() => nexusDir);
  }

  managedOld(item) {
    const name = item.name;
    const path = fullpath(name);
    const stat = Rx.Observable.bindNodeCallback(fs.stat);
    return stat(path)
      .map(stat => stat.ctimeMs)
      .flatMap((time) => {
        const renameSync = Rx.Observable.bindNodeCallback(fs.rename);
        return renameSync(path, `${path}.${time}`);
      })
      .catch(() => Rx.Observable.of(item));
  }

  deploy(configuration, item) {
    return this.deploySync(configuration, item.name, fullpath(item.name));
  };

  deploySync(configuration, nameArtifact, pathWar) {
    const root = host(configuration);
    const parsingUrl = URL.parse(root);
    const url = `${root}/manager/text/deploy?path=/${nameArtifact}&update=true`;
    const options = {
      host: parsingUrl.hostname,
      method: 'PUT',
      port: parsingUrl.port,
      path: url,
      auth: `${configuration.username}:${configuration.password}`
    };
    const readFile = Rx.Observable.bindNodeCallback(fs.readFile);
    return readFile(pathWar).flatMap(d => {
      return Rx.Observable.create((subscriber) => {
        const req = http.request(options, (rs) => {
          let result = '';
          rs.on('data', (data) => {
            result += data;
          });
          rs.on('end', () => {
            if (rs.statusCode === 200 && result.indexOf('ECHEC') === -1 && result.indexOf('FAIL') === -1) {
              subscriber.next(result);
              subscriber.complete();
            } else {
              subscriber.error(rs);
            }
          });
        }).on('error', (e) => {
          subscriber.error(e);
        });
        req.end(d);
      });
    });
  }


  download(item) {
    const name = item.name;
    const url = item.url;
    const war = warname(name);
    const path = fullpath(name);
    const file = fs.createWriteStream(path);
    const g = Rx.Observable.bindCallback(http.get);
    return g(url)
      .flatMap((response) => {
        if (response.statusCode !== 200) {
          logger.error(`download item failure ${response.statusCode}`);
          return Rx.Observable.throw(response);
        }
        response.pipe(file);
        return Rx.Observable.create((sub) =>
          file.on('finish', () => {
            file.close(() => {
              sub.next(war);
              sub.complete();
            });
          })
        );
      });
  }

  rollback(configuration, item, oldVersion) {
    const root = host(configuration);
    const parsingUrl = URL.parse(root);
    const url = `${root}/manager/text/deploy?path=/${item.name}&update=true`;
    const options = {
      host: parsingUrl.hostname,
      method: 'PUT',
      port: parsingUrl.port,
      path: url,
      auth: `${configuration.username}:${configuration.password}`
    };
    const readFile = Rx.Observable.bindNodeCallback(fs.readFile);
    return readFile(`${downloadedDir}/${oldVersion.f}`)
      .flatMap(d => {
          return Rx.Observable.create((subscriber) => {
            const req = http.request(options, (rs) => {
              let result = '';
              rs.on('data', (data) => {
                result += data;
              });
              rs.on('end', () => {
                if (rs.statusCode === 200) {
                  subscriber.next(result);
                  subscriber.complete();
                } else {
                  subscriber.error(rs);
                }
              });
            }).on('error', (e) => {
              subscriber.error(e);
            });

            req.end(d);
          });
        }
      );
  }

  test(h, username, password) {
    const root = `http://${h}`;
    const parsingUrl = URL.parse(root);
    const url = `${root}/manager/text/list`;
    const options = {
      host: parsingUrl.hostname,
      method: 'GET',
      port: parsingUrl.port,
      path: url,
      auth: `${username}:${password}`
    };
    return Rx.Observable.create((subscriber) => {
      http.get(options, (rs) => {
        const bodyChunks = [];
        rs.on('data', (chunk) => {
          bodyChunks.push(chunk);
        }).on('end', () => {
          const body = Buffer.concat(bodyChunks).toString('utf8');
          subscriber.next({status: rs.statusCode, body});
          subscriber.complete();
        });
      }).on('error', (e) => {
        logger.error('Error inc calling', e);
        const body = e.message || 'Error';
        subscriber.error({status: 404, body});
      });
    });
  }


  undeploy(configuration, item) {
    const root = host(configuration);
    const parsingUrl = URL.parse(root);
    const url = `${root}/manager/text/undeploy?path=/${item.name}`;
    const options = {
      host: parsingUrl.hostname,
      method: 'GET',
      port: parsingUrl.port,
      path: url,
      auth: `${configuration.username}:${configuration.password}`
    };
    return Rx.Observable.create((subscriber) => {
      http.get(options, (rs) => {
        let result = '';
        rs.on('data', (data) => {
          result += data;
        });
        rs.on('end', () => {
          if (rs.statusCode === 200) {
            subscriber.next(result);
            subscriber.complete();
          } else {
            subscriber.error(rs);
          }
        });
      }).on('error', (e) => {
        subscriber.error(e);
      });
    });
  }
}


module.exports = new WarManager();
