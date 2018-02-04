const express = require('express');
const deploydb = require('../deploydb');
const nexus = require('../actions/nexus');
const router = express.Router();
const bodyParser = require('body-parser');


router.get('/', (req, res) => {
  const config = deploydb.nexus() || {data: [{}]};
  const json = config.data[0] || {};
  res.json(json);
});

router.get('/test', (req, res) => {
  const host = req.query.host;
  const port = req.query.port;
  const context = req.query.context;
  nexus.up(host, port, context).then(d => res.json(d), d => res.json(d));
});


router.get('/artifact/search', (req, res) => {
  const host = req.query.host;
  const port = req.query.port;
  const q = req.query.q;
  nexus.search(host, port, q).then(d => res.json(d), d => res.json(d));
});

router.get('/artifact/versions', (req, res) => {
  const nexusDb = deploydb.nexus() || {data: [{}]};
  const config = nexusDb.data[0];
  const db = deploydb.files() || {data: []};
  const nexusArtifacts = db.data.filter(a => a.groupId && a.artifactId);
  nexus.reload(config.host, config.port, nexusArtifacts).then(d => res.json(d), d => res.json(d));
});

router.get('/artifact', (req, res) => {
  const groupId = req.query.g;
  const artifactId = req.query.a;
  nexus.valid(groupId, artifactId).subscribe(
    d => res.json(d),
    err => {
      console.error(err);
      res.status(404);
      res.json(err);
    });
});

router.put('/', bodyParser.json(), (req, res) => {
  const body = req.body;
  const config = deploydb.nexus();
  const data = Object.assign({}, config.data[0], body);
  config.data.filter((d, i) => i > 0).forEach(d => deploydb.remove(config, d));
  deploydb.save(config, data);
  res.json(body);
});

module.exports = router;
