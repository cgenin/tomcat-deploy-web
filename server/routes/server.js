const express = require('express');
const deploydb = require('../deploydb');
const war = require('../war-manager');
const router = express.Router();
const bodyParser = require('body-parser');

router.get('/', (req, res) => {
  const config = deploydb.config() || {data: [{}]};
  const data = Array.from(config.data);
  res.json(data.map(d => {
    const tmp = Object.assign({}, d);
    tmp.id = tmp.$loki;
    return tmp;
  }));
});

router.get('/auth', (req, res) => {
  const host = req.query.host;
  const username = req.query.username;
  const password = req.query.password;
  war.test(host, username, password).subscribe(
    (d) => res.json(d), (e) => res.json(e));
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
