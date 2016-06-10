const express = require('express');
const deploydb = require('../deploydb');
const nexus = require('../nexus');
const router = express.Router();
const bodyParser = require('body-parser');

router.get('/', (req, res) => {
  const config = deploydb.nexus() || { data: [{}] };
  res.json(config.data[0]);
});

router.get('/test', (req, res) => {
  const host = req.query.host;
  const port = req.query.port;
  nexus.up(host, port).then(d => res.json(d), d => res.json(d));
});


router.get('/artifact/search', (req, res) => {
  const host = req.query.host;
  const port = req.query.port;
  const q = req.query.q;
  nexus.search(host, port, q).then(d => res.json(d), d => res.json(d));
});

router.get('/artifact/versions', (req, res) => {
  const nexusDb = deploydb.nexus() || { data: [{}] };
  const config = nexusDb.data[0];
  const db = deploydb.files() || { data: [] };
  const nexusArtifacts = db.data.filter(a => a.groupId && a.artifactId);
  nexus.reload(config.host, config.port, nexusArtifacts).then(d => res.json(d), d => res.json(d));
});

router.get('/artifact', (req, res) => {
  const host = req.query.host;
  const port = req.query.port;
  const groupId = req.query.g;
  const artifactId = req.query.a;
  nexus.valid(host, port, groupId, artifactId).then(d => res.json(d), d => res.json(d));
});

router.put('/', bodyParser.json(), (req, res) => {
  const body = req.body;
  const config = deploydb.nexus();
  deploydb.save(config, body);
  res.json(body);
});

module.exports = router;
