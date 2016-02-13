'use strict';
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const serverRest = require('./routes/server');
const artifact = require('./routes/artifact');

const deploydb = require('./deploydb');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/api/server', serverRest);
app.use('/api/artifact', artifact);

require('./routes')(app);

deploydb.init().then(() => {
  console.log('db started.');
});

module.exports = app;
