const express = require('express');
const deploydb = require('../deploydb');
const router = express.Router();
const bodyParser = require('body-parser');

/* GET users listing. */
router.get('/', (req, res) => {
  const config = deploydb.config() || {data: [{}]};
  const data = Array.from(config.data);
  res.json(data.map(d => {
    const tmp = Object.assign({}, d);
    tmp.id = tmp.$loki;
    return tmp;
  }));
});

router.post('/', bodyParser.json(), (req, res) => {
  const body = req.body;
  const config = deploydb.config();
  deploydb.save(config, body);
  res.json(body);
});

router.delete('/', bodyParser.json(), (req, res) => {
  const body = req.body;
  const files = deploydb.config();
  deploydb.remove(files, body);
  res.json(deploydb.config().data);
});

module.exports = router;
