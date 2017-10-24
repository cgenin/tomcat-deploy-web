'use strict';

const http = require('http');
const Q = require('q');
const Rx = require('rxjs/Rx');
const {execFile} = require('child_process');

const up = function (host, port, context) {
  const deferred = Q.defer();
  const url = `http://${host}:${port}${context}`;
  try {


    const options = {
      host,
      port,
      path: `${context}`
    };
    http.get(options, (rs) => {
      rs.on('data', (d) => {
        console.log(d.toString());
      });
      rs.on('end', () => {
        const statusCode = rs.statusCode;
        deferred.resolve({statusCode, url});
      });
      rs.on('error', (e) => {
        console.error(e);
        deferred.resolve({statusCode: 500, url});
      });
    }).on('error', (e) => {
      console.error(e);
      deferred.resolve({statusCode: 500, url});
    });
  } catch (e) {
    console.error(e);
    deferred.reject({statusCode: 500, url});
  }
  return deferred.promise;
};

const search = function (host, port, q) {
// http://intserv:8081
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
        console.error(e);
        deferred.resolve({statusCode: 500, url});
      });
    });
    req.on('error', (e) => {
      console.error(e);
      deferred.resolve({statusCode: 500, url});
    });

    req.end();
  } catch (e) {
    console.error(e);
    deferred.reject({statusCode: 500, url});
  }
  return deferred.promise;
};

const valid = function (groupId, artifactId, packaging = 'war', version = 'LATEST') {
  const ef = Rx.Observable.bindNodeCallback(execFile);
  return ef('mvn.bat', [
    'dependency:get',
    `-DgroupId=${groupId}`,
    `-DartifactId=${artifactId}`,
    `-Dversion=${version}`,
    `-Dpackaging=${packaging}`,
    '-Dtransitive=false'
  ], {encoding: 'utf8'})
    .map((arr) => {
        const stdout = arr[0];
        const stderr = arr[1];
        if (stderr !== '') {
          console.error(stderr)
          throw new Error(`${groupId}.${artifactId} - version : ${version} - not found`)
        }
        const found =  /SUCCESS/g.test(stdout);
        return {found, stdout};
      }
    );
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
    console.error(e);
    deferred.reject(e);
  });
  return deferred.promise;
};


module.exports = {
  up, valid, search, reload

};
