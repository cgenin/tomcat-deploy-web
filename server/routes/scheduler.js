const express = require('express');
const deploydb = require('../deploydb');
const logger = require('../logger');
const cronManager = require('../actions/cron-manager');
const router = express.Router();
const bodyParser = require('body-parser');


const searchByReqId = (req) => {
  const {id} = req.params;
  const schedulers = deploydb.schedulers().data;
  return schedulers.find(s => s.$loki === parseInt(id));
};
const getJobs = () => {
  const items = deploydb.schedulers().data;
  const runnings = cronManager.getRunning();
  return items.map(item => {
    const running = runnings.find(r => r.name === item.name);
    if (running) {
      return Object.assign({run: true}, item, running)
    }
    return Object.assign({run: false}, item)
  });
};
module.exports = () => {

  router.get('/', (req, res) => {
    const results = getJobs();
    res.json(results);
  });

  router.post('/', bodyParser.json(), (req, res) => {
    const job = req.body;
    const schedulers = deploydb.schedulers();
    deploydb.save(schedulers, job);
    res.json(deploydb.files().data);
  });

  router.get('/:cron/validate', (req, res) => {
    const {cron} = req.params;
    cronManager.test(cron).subscribe(
      d => {
        const json = Object.assign({}, d, {valid: true});
        res.json(json);
      },
      err => {
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
          err => {
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
        }, err => {
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
        }, err => {
          logger.error(err);
          res.status(500);
          res.json([]);
        },
        () => res.json(getJobs()));
  });

  return router;
};
