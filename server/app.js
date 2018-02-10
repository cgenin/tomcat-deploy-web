'use strict';
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');

require('./backup').load().subscribe((inner) => console.log('backup versions initialized'), err => console.error(err));

const deploydb = require('./deploydb');

const app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../build')));

deploydb.init().subscribe(
  (db) => {
    console.log('db started.' + db);
  },
  (err) => console.error(err),
  () => {
    require('./actions/cron-manager')
      .startAll()
      .subscribe(
        run => console.log(run),
        err => {
          console.error('error in starting job', err);
        },
        () => console.log('All jobs started'));
  });

module.exports = app;
