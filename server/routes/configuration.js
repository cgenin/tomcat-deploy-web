const express = require('express');
const deploydb = require('../deploydb');

module.exports = () => {
  const router = express.Router();
  router.get('/', (req, res) => {
    const first = deploydb.toolConfiguration().data[0] || {};
    res.json(first);
  });

  router.post('/', (req, res) => {
    const toolConfiguration = deploydb.toolConfiguration();
    const init = toolConfiguration.data[0] || {};
    const newConf = req.body;
    const result = Object.assign({}, init, newConf);
    deploydb.save(toolConfiguration, result);
    res.json(toolConfiguration.data);
  });
  return router;
};
