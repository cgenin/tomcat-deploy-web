const cron = require('cron');
const Rx = require('rxjs/Rx');
const deploydb = require('../deploydb');
const logger = require('../logger');
const CronJob = cron.CronJob;

let instance = null;

const schedulingDataJob = (job) => {
  if (job.date) {
    return new Date(job.date);
  }
  return job.cron;
};

const nextDates = (job) => {
  try {
    return job.nextDates().toDate();
  } catch (err) {
    return null;
  }
};

class CronManager {
  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;
    this.running = [];
  }


  startAll() {
    const arr = deploydb.schedulers().data
      .map(j => {
        return this.start(j);
      });
    return Rx.Observable.concat(...arr);
  }

  __deploy(job) {
    // TODO
    logger.info(job);
  }


  getRunning() {
    const keys = Object.keys(this.running);
    return keys
      .map(name => {
        const job = this.running[name];
        if (!job) {
          return null;
        }
        const {lastDate, running, runOnce} = job;
        const nextDate = nextDates(job);
        return {lastDate, nextDate, running, runOnce, name};
      })
      .filter(job => {
        return (job);
      });
  }

  test(cron) {


    return Rx.Observable.of(cron)
      .map(() => {
        const cronJob = new CronJob(cron,
          () => {
            logger.info(`Test cron`);
          }, () => {
            logger.info(`job '${name}' is stopped.`);
          }, false);
        const nextDates = cronJob.nextDate().toDate();
        return {nextDates};
      });
  }

  stop(job) {
    if (!job) {
      return Rx.Observable.empty();
    }
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
    if (!job) {
      return Rx.Observable.empty();
    }

    return Rx.Observable.of(job)
      .map(() => {
        const {name} = job;
        try {
          if (this.running[name]) {
            return {name, running: true};
          }
          const launchTime = schedulingDataJob(job);
          this.running[name] = new CronJob(launchTime,
            () => {
              this.__deploy(job);
            }, () => {
              logger.info(`job '${name}' is stopped.`);

            }, true);
          return {name, running: true};
        } catch (err) {
          logger.error('error in creating job', err);
        }
        return {name, running: false, failure: true};
      });
  }
}

module.exports = new CronManager();
