const express = require('express');
const history = require('../history');

module.exports = () => {
  const router = express.Router();
  router.get('/', (req, res) => {
    const items = history.getAll();
    res.json(items.data);
  });
  return router;
};
