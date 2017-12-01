const deploydb = require('./deploydb');

const update = function (server, date, name, result, method) {
  deploydb.save(deploydb.history(), {server, date, name, result, method});
};

const getAll = function () {
  return deploydb.history() || {data: []};
};

module.exports = {update, getAll};
