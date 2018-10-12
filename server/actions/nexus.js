'use strict';

const http = require('http');
const fs = require('fs');
const os = require('os');
const Q = require('q');
const Rx = require('rxjs/Rx');
const {spawn} = require('child_process');
const logger = require('../logger');

/**
 * Get the maven
 *
 * @returns {*}
 */
const getMavenCommandLine = () => {
  if (os.platform() === 'win32') {
    return 'mvn.bat';
  }
  return 'mvn';
};

const execFile = (cmd, args) => {
  return Rx.Observable.create(subscriber => {
    const child = spawn(cmd, args);
    let _stdout = '';
    let _stderr = '';
    child.stdout.on('data', (data) => {
      _stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      _stderr += data.toString();
    });

    child.on('exit', (code) => {
      subscriber.next([_stdout, _stderr, code]);
      subscriber.complete();
    });
    child.addListener('close', () => {
      subscriber.next([_stdout, _stderr]);
      subscriber.complete();
    });
  });
};


const search = function (host, port, q) {
  const deferred = Q.defer();
  const url = `http://${host}:${port}/nexus/service/local/lucene/search?q=${q}`;
  try {
    const options = {
      host,
      port,
      method: 'GET',
      path: url,
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}
    };
    const req = http.request(options, (rs) => {
      let respString = '';
      rs.on('data', (d) => {
        respString += d;
      });
      rs.on('end', () => {
        const statusCode = rs.statusCode;
        const body = JSON.parse(respString);
        deferred.resolve({statusCode, url, body});
      });
      rs.on('error', (e) => {
        logger.error(e);
        deferred.resolve({statusCode: 500, url});
      });
    });
    req.on('error', (e) => {
      logger.error(e);
      deferred.resolve({statusCode: 500, url});
    });

    req.end();
  } catch (e) {
    logger.error(e);
    deferred.reject({statusCode: 500, url});
  }
  return deferred.promise;
};

const valid = function (groupId, artifactId, packaging = 'war', version = 'LATEST') {
  return execFile(getMavenCommandLine(), [
    'dependency:get',
    `-DgroupId=${groupId}`,
    `-DartifactId=${artifactId}`,
    `-Dversion=${version}`,
    `-Dpackaging=${packaging}`,
    '-Dtransitive=false'
  ], {encoding: 'utf8', maxBuffer: 1024 * 300})
    .map((arr) => {
        const brut = arr[0];
        const stderr = arr[1];
        if (stderr !== '') {
          logger.error(stderr);
          throw new Error(`${groupId}.${artifactId} - version : ${version} - not found`)
        }
        const found = /SUCCESS/g.test(brut);
        const stdout = brut.replace(/[0-9]+\/[0-9]+ KB/g, '').replace(/[\s]*[\r]*[\n]+/g, '\n');
        return {found, stdout};
      }
    );
};


const copy = function (groupId, artifactId, outputDirectory, packaging = 'war', version = 'LATEST') {
  const readdir = Rx.Observable.bindNodeCallback(fs.readdir);
  return execFile(getMavenCommandLine(), [
    '-U',
    'dependency:copy',
    `-Dartifact=${groupId}:${artifactId}:${version}:${packaging}`,
    `-DoutputDirectory=${outputDirectory}`
  ], {encoding: 'utf8', maxBuffer: 1024 * 300})
    .flatMap(() => {
      return readdir(outputDirectory)
    })
    .map(files => {
      const filename = files[0];
      return outputDirectory + '/' + filename;
    });
};


const reload = function (host, port, artifacts) {
  const deferred = Q.defer();
  Q.all(artifacts.map(a => {
    const artifactId = a.artifactId;
    const groupId = a.groupId;
    return valid(host, port, groupId, artifactId);
  })).then((results) => {
    const res = results.map(r => {
      return r.body;
    })
      .map(obj => {
        return {
          artifactId: obj.data[0].artifactId,
          groupId: obj.data[0].groupId,
          versions: obj.data.map(d => d.version)
        };
      })
      .map(obj => {
        const artifact = artifacts.find(a => a.artifactId === obj.artifactId && a.groupId === obj.groupId);
        return {id: artifact.$loki, nexus: obj};
      });
    deferred.resolve(res);
  }).catch(e => {
    logger.error(e);
    deferred.reject(e);
  });
  return deferred.promise;
};


module.exports = {
  copy, valid, search, reload
};
