const express = require('express');
const deploydb = require('../deploydb');
const logger = require('../logger');
const cronManager = require('../actions/cron-manager');
const rc = require('../ws/RemoteConsole');
const router = express.Router();
const bodyParser = require('body-parser');


const searchByReqId = (req) => {
  const {id} = req.params;
  const schedulers = deploydb.schedulers().data;
  return schedulers.find(s => s.$loki === parseInt(id));
};

/**
 * Compute all job's schedulers.
 */
const getJobs = () => {
  const items = deploydb.schedulers().data;
  const runnings = cronManager.getRunning();
  return items.map((item) => {
    const running = runnings.find(r => r.name === item.name);
    if (running) {
      return Object.assign({run: true}, item, running);
    }
    return Object.assign({run: false}, item);
  });
};
module.exports = () => {
  /**
   * @api {get} /scheduler Get all scheduling job's
   * @apiName GetScheduler
   * @apiGroup Scheduler
   *
   * @apiSuccess {Object[]} schedulers              an Array of Schedulers.
   * @apiSuccess {Number}   schedulers.loki         The Id Scheduler.
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   * [
   *   {
   *    "$loki" : 7,
        "artifacts" :  [{name: "dssdsd", url: "http://localhost:5000/war/webapp-test.war", groupId: "net.genin",…}],
        "date" : "2018-02-11T13:15:00.411Z"
        "name" : "qsqsqsqsq",
        "run" : false,
        "server" : {host: "localhost:8080", name: "local", username: "tomcat", password: "", ...},
        "type" : "job"
       },
   *   ...
   *  ]
   */
  router.get('/', (req, res) => {
    const results = getJobs();
    res.json(results);
  });

  /**
   * @api {post} /scheduler Create an scheduling job.
   * @apiName CreateScheduler
   * @apiGroup Scheduler
   *
   * @apiParam {String} name Name of the job.
   * @apiParam {String} type Type of the job : 'job' or 'nexus'
   * @apiParam {Date} date for deploying once at an specific date.
   * @apiParam {String} cron Cron expression for the specifying the launch job.
   * @apiParam {Array} artifacts list of the artifacts to deploy for type 'job'.
   * @apiParam {Object} server Server data.
   * @apiParam {Array} nexus Array of deploying nexus's artifacts.
   * @apiParamExample {json} Request-Example:
   *   {
        "nexus" :  [...],
        "cron" : "* * * *"
        "name" : "qsqsqsqsq",
        "run" : false,
        "server" : {host: "localhost:8080", name: "local", username: "tomcat", password: "", ...},
        "type" : "nexus"
       },
   * @apiSuccess {Object[]} schedulers The list of all scheduling's jobs. The same response of an 'get' response.
   */
  router.post('/', bodyParser.json(), (req, res) => {
    const job = req.body;
    const schedulers = deploydb.schedulers();
    deploydb.save(schedulers, job);
    cronManager.start(job)
      .subscribe(
        (result) => {
          const {name, running, failure} = result;
          if (failure) {
            rc.error(`The job '${name}' not started. An failure occured`);
          } else {
            const state = (running) ? 'is started' : 'is not started.';
            rc.log(`The job '${name}' ${state}.`);
          }
        },
        () => {
          res.status(500);
          res.json([]);
        },
        () => {
          res.json(getJobs());
        });
  });

  router.get('/:cron/validate', (req, res) => {
    const {cron} = req.params;
    cronManager.test(cron).subscribe(
      (d) => {
        const json = Object.assign({}, d, {valid: true});
        res.json(json);
      },
      (err) => {
        const {message, stack} = err;
        res.json({message, stack, valid: false});
      }
    );
  });

  router.delete('/:id', (req, res) => {
    const itemToRemove = searchByReqId(req);
    if (itemToRemove) {
      cronManager.stop(itemToRemove)
        .subscribe(
          () => {
            deploydb.remove(deploydb.schedulers(), itemToRemove)
          },
          (err) => {
            logger.error(err);
            res.status(500);
            res.json([]);
          },
          () => res.json(deploydb.schedulers().data)
        );
    } else {
      res.json(deploydb.schedulers().data);
    }
  });

  router.get('/:id/run', (req, res) => {
    const current = getJobs().find(j => j.$loki === parseInt(req.params.id));
    res.json(current);
  });

  router.put('/:id/run', (req, res) => {
    const itemToStart = searchByReqId(req);
    cronManager.start(itemToStart)
      .subscribe((result) => {
          logger.info(result);
        }, (err) => {
          logger.error(err);
          res.status(500);
          res.json([]);
        },
        () => res.json(getJobs()));
  });


  router.delete('/:id/run', (req, res) => {
    const itemToStop = searchByReqId(req);
    cronManager.stop(itemToStop)
      .subscribe((result) => {
          logger.info(result);
        }, (err) => {
          logger.error(err);
          res.status(500);
          res.json([]);
        },
        () => res.json(getJobs()));
  });

  return router;
};
