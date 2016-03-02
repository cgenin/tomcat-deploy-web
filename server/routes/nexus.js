const express = require('express');
const deploydb = require('../deploydb');
const router = express.Router();
const bodyParser = require('body-parser');

router.get('/', (req, res) => {
  const config = deploydb.nexus() || {data: [{}]};
  res.json(config.data[0]);
});

router.put('/', bodyParser.json(), (req, res) => {
  const body = req.body;
  const config = deploydb.nexus();
  deploydb.save(config, body);
  res.json(body);
});

module.exports = router;