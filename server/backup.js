const fs = require('fs');
const Rx = require('rxjs/Rx');
const config = require('./config');
const downloadedDir = config.downloadedDir;

const def = /^(.*?)\.war$/;
const old = /^(.*?)\.war\.([0-9]+?)$/;

let instance = null;

class Backup {

  constructor() {
    if (instance) {
      return this;
    }
    instance = this;
    this.inner = {};
  }


  load(filter) {
    if (filter) {
      this.inner[filter] = [];
    } else {
      this.inner = {};
    }
    const readdir = Rx.Observable.bindNodeCallback(fs.readdir);
    return readdir(downloadedDir)
      .flatMap((files) => {
          return Rx.Observable.of(...files);
        }
      )
      .filter((f) => !filter || f.indexOf(filter) !== -1)
      .filter(f => def.test(f) || old.test(f))
      .flatMap((f) =>
        Rx.Observable.if(
          () => def.test(f),
          // last artifacted deplyed
          Rx.Observable.of(f)
            .flatMap(() => {
              const fsStat = Rx.Observable.bindNodeCallback(fs.stat);
              return fsStat(`${downloadedDir}/${f}`);
            })
            .map((stat) => {
              const name = def.exec(f)[1];
              const dt = stat.ctime.getTime();
              return {f, name, dt, date: new Date(dt)}
            }),
          // old artifacts
          Rx.Observable.of(f)
            .map(() => {
              const reOld = old.exec(f);
              const name = reOld[1];
              const dt = parseInt(reOld[2], 10);
              return {f, name, dt, date: new Date(dt)};
            }))
      )
      .reduce((acc, obj) => {
        if (!acc[obj.name]) {
          acc[obj.name] = [];
        }
        acc[obj.name].push(obj);
        acc[obj.name].sort((a, b) => b.dt - a.dt);
        return acc;
      }, this.inner);
  }

  clean(nb) {
    const filtering = (o, i) => i >= nb;
    return Rx.Observable.if(
      () => nb,
      Rx.Observable.of(Object.keys(this.inner))
        .flatMap(keys => Rx.Observable.of(...keys))
        .map(key => this.inner[key])
        .map(values => values.filter(filtering))
        .flatMap(values => Rx.Observable.of(...values))
        .flatMap(v2Delete => {
          const unlink = Rx.Observable.bindNodeCallback(fs.unlink);
          return unlink(`${downloadedDir}/${v2Delete.f}`);
        })
        .takeLast(1),
      Rx.Observable.of(this.inner)
    )
      .flatMap(() => this.load());

  }

  data() {
    return this.inner;
  }
}


module.exports = new Backup();
