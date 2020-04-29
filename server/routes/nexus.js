const express = require('express');
const deploydb = require('../deploydb');
const logger = require('../logger');
const nexus = require('../actions/nexus');
const bodyParser = require('body-parser');

const router = express.Router();

router.get('/', (req, res) => {
  const config = deploydb.nexus() || {data: [{}]};
  const json = config.data[0] || {};
  res.json(json);
});

router.delete('/', bodyParser.json(), (req, res) => {
  const {body} = req;
  const pathM2 = body.pathM2 || 'C:/dev_intranet/.m2/';
  const suffix = body.suffix || '*.war';
  nexus.purge(pathM2, suffix)
    .subscribe(
      d => res.json(d),
      (err) => {
        logger.error(err);
        res.status(404);
        res.json(err);
      }
    );
});


router.get('/test', (req, res) => {
  const {
    host,
    port,
    context
  } = req.query;
  nexus.up(host, port, context).then(d => res.json(d), d => res.json(d));
});

router.get('/maven/version', (req, res) => {
  nexus.mavenVersion().subscribe(d => res.json(d),     (err) => {
    logger.error(err);
    res.status(404);
    res.json(err);
  });
});

router.get('/artifact/search', (req, res) => {
  const {
    host,
    port,
    q
  } = req.query;
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
    (err) => {
      logger.error(err);
      res.status(404);
      res.json(err);
    });
});

router.get('/download/:groupId/:artifactId/:version/to/:name', (req, res) => {
  const {groupId, artifactId, version, name} = req.params;
  nexus.download(groupId, artifactId, version)
    .subscribe((data) => {
        res.writeHead(200, {
          'Cache-Control': 'public',
          'Content-Description': 'File Transfer',
          'Content-Type': 'binary/octet-stream',
          'Content-Transfer-Encoding': 'binary',
          'Content-disposition': `attachment;filename=${name}.war`,
          'Content-Length': data.length
        });
        res.end(new Buffer(data, 'binary'));
      },
      (err) => {
        logger.error(err);
        res.status(404);
        res.json(err);
      });
});


router.put('/', bodyParser.json(), (req, res) => {
  const {body} = req;
  const config = deploydb.nexus();
  const data = Object.assign({}, config.data[0], body);
  config.data.filter((d, i) => i > 0).forEach(d => deploydb.remove(config, d));
  deploydb.save(config, data);
  res.json(body);
});

module.exports = router;
