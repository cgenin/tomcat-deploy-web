module.exports = require('yargs').usage('$0 [port] [dbpath]')
  .options({
    p: {
      alias: 'port',
      default: 5000,
      describe: 'the port of the server',
      type: 'number'
    },
    d: {
      alias: 'dbpath',
      default: 'db/data.json',
      describe: 'The database\'s path',
      type: 'string'
    }
  })
  .help()
  .argv;
