const express = require('express');
const Rx = require('rxjs/Rx');
const logger = require('../logger');


module.exports = () => {
  const router = express.Router();
  router.get('/', (req, res) => {
    const reqOpts = req.params;
    // const query = Rx.Observable.bindNodeCallback(logger.query);
    const today = new Date();
    const defOptions = {
      from: today - (24 * 60 * 60 * 1000),
      until: today,
      limit: 25,
      start: 0,
      order: 'desc',
    };

    const options = {...defOptions, ...reqOpts};
    logger.query(options, (err, results) => {
      if (err) {
        logger.error('error in retreiving history', err);
        res.status(500);
        res.json();
        return;
      }
      res.json({options, results: results.file});
    });

  });
  return router;
};
