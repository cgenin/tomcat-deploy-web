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


// router.get('/test2', (req, res) => {
//   const groupId = 'fr.mdpa.ms.metier.mdpa.societaire';
//   const artifactId = 'societaire-service-impl';
//   const version = '1.1.3';
//   const packaging = 'war';
//   const ef = Rx.Observable.bindNodeCallback(execFile);
//   ef('mvn.bat', [
//     'dependency:get',
//     `-DgroupId=${groupId}`,
//     `-DartifactId=${artifactId}`,
//     `-Dversion=${version}`,
//     `-Dpackaging=${packaging}`,
//     '-Dtransitive=false'
//   ])
//     .flatMap(() => ef('mvn.bat', [
//         'dependency:copy',
//         `-Dartifact=${groupId}:${artifactId}:${version}:${packaging}`,
//         '-DoutputDirectory=download/versions'
//       ])
//     ).subscribe(
//     (arr) => {
//       console.log(arr);
//       res.json(arr);
//     },
//     err => {
//       console.error(err);
//       res.json({error: true});
//     })
// });

module.exports = router;
