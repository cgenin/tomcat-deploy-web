const express = require('express');
const deploydb = require('../deploydb');
const backup = require('../backup');
const router = express.Router();
const bodyParser = require('body-parser');

module.exports = (io) => {
  router.get('/', (req, res) => {
    const items = deploydb.files() || {data: []};
    res.json(items.data);
  });


  router.post('/', bodyParser.json(), (req, res) => {
    const artifact = req.body;
    const files = deploydb.files();
    const tmpHttp = (artifact.url.indexOf('http://') === -1) ? `http://${artifact.url}` : artifact.url;
    artifact.url = tmpHttp;
    deploydb.save(files, artifact);
    res.json(deploydb.files().data);
  });

  router.delete('/last/:nb', (req, res) => {
    const nb = req.params.nb;
    res.json(backup.clean(nb));
    io.sockets.emit('snackbar', {});
  });


  router.delete('/', bodyParser.json(), (req, res) => {
    const body = req.body;
    const files = deploydb.files();
    deploydb.remove(files, body);
    res.json(deploydb.files().data);
  });

  return router;
};
