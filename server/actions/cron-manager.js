const cron = require('cron');
const Rx = require('rxjs/Rx');
const deploydb = require('../deploydb');
const CronJob = cron.CronJob;

let instance = null;

class CronManager {
  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;
    this.running = [];
  }


  startAll() {
    const arr = deploydb.schedulers()
      .map(j => {
        return this.start(j);
      });
    return Rx.Observable.concat(...arr);
  }

  __deploy(job) {
    // TODO
    console.log(job);
  }

  getRunnning() {
    return Object.keys(this.running);
  }

  stop(job) {
    return Rx.Observable.of(job)
      .map(() => {
        const {name} = job;
        const running = this.running[name];
        if (running) {
          running.stop();
          this.running[name] = null;
        }
        return {name, running: false};
      });
  }

  start(job) {
    return Rx.Observable.of(job)
      .map(() => {
        const {name} = job;
        try {
          if (this.running[name]) {
            return {name, running: true};
          }
          const launchTime = job.date || job.cron;
          this.running[name] = new CronJob(launchTime,
            () => {
              this.__deploy(job);
            }, () => {
              console.log(`job '${name}' is stopped.`);

            }, true);
          return {name, running: true};
        } catch (err) {
          console.log('error in creating job', err);
        }
        return {name, running: false, failure: true};
      });
  }
}

module.exports = new CronManager();
