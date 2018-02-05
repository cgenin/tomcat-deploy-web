const express = require('express');
const deploydb = require('../deploydb');
const router = express.Router();
const bodyParser = require('body-parser');


module.exports = () => {

  router.get('/', (req, res) => {
    const items = deploydb.schedulers() || {data: []};
    res.json(items);
  });

  router.post('/', bodyParser.json(), (req, res) => {
    const job = req.body;
    const schedulers = deploydb.schedulers();
    deploydb.save(schedulers, job);
    res.json(deploydb.files().data);
  });

  router.get('/:id/run', bodyParser.json(), (req, res) => {
    // TODO implements
    res.json({});
  });

  router.put('/:id/run', bodyParser.json(), (req, res) => {
    // TODO implements
    res.json({});
  });


  router.delete('/:id/run', bodyParser.json(), (req, res) => {
    // TODO implements
    res.json({});
  });

  return router;
};
