'use strict';

const fs = require('fs');
const config = require('./config');
const downloadedDir = config.downloadedDir;

const Backup = function Backup() {
  let inner = {};

  this.load = function (filter) {
    fs.readdir(downloadedDir, (err, files) => {
      if (err) {
        return;
      }
      if (filter) {
        inner[filter] = [];
      } else {
        inner = {};
      }

      const def = /^(.*?)\.war$/;
      const old = /^(.*?)\.war\.([0-9]+?)$/;

      files.forEach((f) => {
        if (filter && f.indexOf(filter) === -1) {
          return;
        }
        if (def.test(f)) {
          const name = def.exec(f)[1];
          const stat = fs.statSync(`${downloadedDir}/${f}`);
          const dt = stat.ctime.getTime();
          if (!inner[name]) {
            inner[name] = [];
          }
          inner[name].push({f, name, dt, date: new Date(dt)});
          inner[name].sort((a, b) => b.dt - a.dt);
        }
        if (old.test(f)) {
          const reOld = old.exec(f);
          const name = reOld[1];
          const dt = parseInt(reOld[2], 10);
          if (!inner[name]) {
            inner[name] = [];
          }
          inner[name].push({f, name, dt, date: new Date(dt)});
          inner[name].sort((a, b) => b.dt - a.dt);
        }
      });

      // console.log(JSON.stringify(inner));
    });
  };
  this.data = function () {
    return inner;
  };
};


/* ************************************************************************
 SINGLETON CLASS DEFINITION
 ************************************************************************ */
Backup.instance = null;

/**
 * Singleton getInstance definition
 * @return Backup class
 */
Backup.getInstance = function () {
  if (this.instance === null) {
    this.instance = new Backup();
  }
  return this.instance;
};

module.exports = Backup.getInstance();
