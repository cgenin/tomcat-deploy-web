const winston = require('winston');
winston.emitErrs = true;

const defaultConfig = {
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: './logs/all-logs.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
};

const logger = new winston.Logger(defaultConfig);

class SourceLogger {
  constructor(source) {
    this.source = source;
  }

  log(level, message) {
    const {source} = this;
    logger.log(level,
      message, {
        source
      });
  }

  info(message) {
    this.log('info', message);
  }

  warn(message) {
    this.log('warn', message);
  }

  error(message) {
    this.log('error', message);
  }
}

module.exports = logger;
const networkLogger = new SourceLogger('network');
module.exports.stream = {
  write(message, encoding) {
    const msg = message.replace(/\n/, '');
    networkLogger.info(msg);
  }
};
module.exports.consoleWebLogger = new SourceLogger('consoleLog');
module.exports.websocketLogger = new SourceLogger('websocket');
module.exports.cronLogger = new SourceLogger('cron');
