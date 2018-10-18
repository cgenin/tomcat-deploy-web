/* eslint-disable global-require */
const routes = require('./routes/index');

module.exports = (app, io) => {
  app.use('/api/server', require('./routes/server'));
  app.use('/api/nexus', require('./routes/nexus'));
  app.use('/api/scheduler', require('./routes/scheduler')(io));
  app.use('/api/history', require('./routes/history')(io));
  app.use('/api/log', require('./routes/log')(io));
  app.use('/api/artifact', require('./routes/artifact')(io));
  app.use('/api/configuration', require('./routes/configuration')(io));
  app.use('/*', routes);

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use((err, req, res) => {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
};
