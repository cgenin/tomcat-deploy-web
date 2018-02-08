const cron = require('cron');
const Rx = require('rxjs/Rx');
const deployDB = require('../deploydb');

const CronJob = cron.CronJob;

let instance = null;

class CronManager {

  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;
    this.running = {};
  }

  startAll() {
    const jobs = deployDB.schedulers().map(scheduler => {
      return this.start(scheduler);
    });
    return Rx.Observable.concat(...jobs);
  }

  _deploy(job) {
    console.log(job);
  }

  stop(job) {
    const current = running[job.name];
    if(!current) {
      return {name: job.name, running: false};
    }

    return {name: job.name, running: true};
  }

  start(job) {
    if(running[job.name]) {
      return {name: job.name, running: true};
    }
    return Rx.Observable.of(job)
      .map(() => {
        try {
          const time = job.date || job.cron;
          const cj = new CronJob(time, () => {
            this._deploy(job);
          }, () => {
            console.log(job.name);
          }, true);
          running[job.name] = cj;
          return {name: job.name, running: true};
        }
        catch (err) {
          console.error(err);
        }
        return {name: job.name, running: false, failure:true};
      });
  }
}

module.exports = new CronManager();

