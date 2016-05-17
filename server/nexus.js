'use strict';

const http = require('http');
const Q = require('q');

const up = function (host, port) {
  const deferred = Q.defer();
  try {
    const url = `http://${host}:${port}/nexus/service/local/repositories`;

    const options = {
      host,
      port,
      path: `/nexus/service/local/repositories`
    };
    http.get(options, (rs) => {
      rs.on('data', (d) => {
        console.log(d.toString());
      });
      rs.on('end', () => {
        const statusCode = rs.statusCode;
        deferred.resolve({ statusCode, url });
      });
      rs.on('error', (e) => {
        console.error(e);
        deferred.resolve({ statusCode: 500, url });
      });
    }).on('error', (e) => {
      console.error(e);
      deferred.resolve({ statusCode: 500, url });
    });
  } catch (e) {
    console.error(e);
    deferred.reject({ statusCode: 500, url });
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
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    };
    const req = http.request(options, (rs) => {
      let respString = '';
      rs.on('data', (d) => {
        respString += d;
      });
      rs.on('end', () => {
        const statusCode = rs.statusCode;
        const body = JSON.parse(respString);
        deferred.resolve({ statusCode, url, body });
      });
      rs.on('error', (e) => {
        console.error(e);
        deferred.resolve({ statusCode: 500, url });
      });
    });
    req.on('error', (e) => {
      console.error(e);
      deferred.resolve({ statusCode: 500, url });
    });

    req.end();
  } catch (e) {
    console.error(e);
    deferred.reject({ statusCode: 500, url });
  }
  return deferred.promise;
};

const valid = function (host, port, groupid, artifactid) {
  const deferred = Q.defer();
  const url = `http://${host}:${port}/nexus/service/local/lucene/search?g=${groupid}&a=${artifactid}`;
  try {
    const options = {
      host,
      port,
      method: 'GET',
      path: url,
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    };
    const req = http.request(options, (rs) => {
      let respString = '';
      rs.on('data', (d) => {
        respString += d;
      });
      rs.on('end', () => {
        const statusCode = rs.statusCode;
        const body = JSON.parse(respString);
        deferred.resolve({ statusCode, url, body });
      });
      rs.on('error', (e) => {
        console.error(e);
        deferred.resolve({ statusCode: 500, url });
      });
    });
    req.on('error', (e) => {
      console.error(e);
      deferred.resolve({ statusCode: 500, url });
    });

    req.end();
  } catch (e) {
    console.error(e);
    deferred.reject({ statusCode: 500, url });
  }
  return deferred.promise;
};


module.exports = {
  up, valid, search
};
