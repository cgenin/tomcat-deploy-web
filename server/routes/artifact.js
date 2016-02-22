const express = require('express');
const deploydb = require('../deploydb');
const backup = require('../backup');
const router = express.Router();
const bodyParser = require('body-parser');

router.get('/', (req, res) => {
  const items = deploydb.files() || {data: []};
  res.json(items.data);
});


router.post('/', bodyParser.json(), (req, res) => {
  const body = req.body;
  const files = deploydb.files();
  const tmpHttp = (body.url.indexOf('http://') === -1) ? `http://${body.url}` : body.url;
  deploydb.insert(files, {
    name: body.name, url: tmpHttp
  });
  res.json(deploydb.files().data);
});

router.delete('/last/:nb', (req, res) => {
  const nb = req.params.nb;
  res.json(backup.clean(nb));
});


router.delete('/', bodyParser.json(), (req, res) => {
  const body = req.body;
  const files = deploydb.files();
  deploydb.remove(files, body);
  res.json(deploydb.files().data);
});



module.exports = router;
