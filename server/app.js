'use strict';
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const stream = require('./logger').stream;
const logger = require('./logger');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');

require('./backup').load().subscribe(() => logger.info('backup versions initialized'), err => logger.error(err));

const deploydb = require('./deploydb');

const app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(morgan('short',{stream}));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../build')));

deploydb.init().subscribe(
  (db) => {
    logger.info('db started.' + db);
  },
  (err) => logger.error(err),
  () => {
    require('./actions/cron-manager')
      .startAll()
      .subscribe(
        run => logger.info(run),
        err => {
          logger.error('error in starting job', err);
        },
        () => logger.cronLogger.info('All jobs started'));
  });

module.exports = app;
