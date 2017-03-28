const express = require('express');
const http = require('http');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');



const app = express();
const http = require('http');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api/server', serverRest);
app.use('/api/all', all);
app.use('/api/artifact', artifact);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use( (err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
deploydb.init().then(() => {
    console.log('db started.');
});

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

/**
 * create Socket.io
 */
var io = require('socket.io')(server);

io.on('connection', function (socket) {
    var ip = '';
    if (socket && socket.conn && socket.conn.remoteAddress) {
        ip = socket.conn.remoteAddress;
    }
    console.log('connection of ' + ip);
    require('./routes/deploy')(socket, io, ip);
});

module.exports = {
    app: app, server: server
};
