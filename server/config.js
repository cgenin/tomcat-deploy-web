'use strict';
const consolePrefix = require('console-prefix');
const logger = require('./logger');

const platforms = require('../conf/platforms')({
  console: require('console-prefix')('[platforms-bootstrap]')
});

const options = {
  console: consolePrefix('[platforms]')
};

const config = platforms.current()(options);

logger.info('-------------------------------------------------------------');
logger.info('Great, as far as we can tell we have a valid config:', config.name);
logger.info('Let\'s move on');
logger.info('-------------------------------------------------------------');
module.exports = config;
