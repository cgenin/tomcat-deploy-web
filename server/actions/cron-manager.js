const moment = require('moment');
const cron = require('cron');
const Rx = require('rxjs/Rx');
const deploydb = require('../deploydb');
const logger = require('../logger').cronLogger;
const rc = require('../ws/RemoteConsole');
const DeployManager = require('./deploy-manager');

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
    const {type, name, server, artifacts, nexus, runOnce} = job;

    const stopJob = () => {
      if (runOnce) {
        this.stop(job);
      }
    };

    const nextFunc = o => {
      const msg = `artifact '${o.name}' deploy by scheduling job '${name}'`;
      rc.log(msg);
    };

    const errorFunc = () => {
      const msg = `Error in deploying the scheduling job '${name}'. See the logs for further informations.`;
      rc.error(msg);
      stopJob();
    };
    const completeFunc = () => {
      const msg = `End of the scheduling job '${name}'.`;
      rc.log(msg);
      stopJob();
    };
    const waitingMsg = () => {
      rc.log(`wait for deploying the scheduling job '${name}'`);
    };

    switch (type) {
      case 'job' :
        waitingMsg();
        new DeployManager('localhost')
          .deployByUrl(server, artifacts)
          .subscribe(nextFunc, errorFunc, completeFunc);
        break;
      case 'nexus':
        waitingMsg();
        new DeployManager('localhost')
          .deployByNexus(server, nexus)
          .subscribe(nextFunc, errorFunc, completeFunc);
        break;
      default:
        logger.warn(`no deploy options found for '${type}' of '${name}'.`)
    }
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

          if (job.date && moment().isAfter(moment(new Date(job.date)))) {
            const msg = `The date '${job.date}' is before today. The job ${name} is not launched.`;
            logger.warn(msg);
            rc.log(msg);
            return {name, running: false};
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
          logger.error(`error in creating job:  '${name}'`);
          logger.error(err);
        }
        return {name, running: false, failure: true};
      });
  }
}

module.exports = new CronManager();
