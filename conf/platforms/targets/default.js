'use strict';
const path = require('path');

module.exports = {
  app: {
    name: 'Tomcat - Deploy - Web',
    title: 'Tomcat - Deploy - Web'
  },
  server: {
    port: 5000
  },
  folders: {
    build: path.join(__dirname, '../../../public')
  },
  build: {},
  services: {
    html: {
      links: [
       /* {
          rel: 'stylesheet',
          crossorigin: 'anonymous',
          href: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css',
          integrity: 'sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7'
        },*/
        { rel: 'stylesheet', type: 'text/css', href: '/node_modules/bootstrap/dist/css/bootstrap.min.css' },
        { rel: 'stylesheet', type: 'text/css', href: '/node_modules/font-awesome/css/font-awesome.min.css' },
        { rel: 'stylesheet', type: 'text/css', href: '/node_modules/bootstrap-material-design/dist/css/bootstrap-material-design.css' },
        { rel: 'stylesheet', type: 'text/css', href: '/node_modules/bootstrap-material-design/dist/css/ripples.min.css' },
        { rel: 'stylesheet', type: 'text/css', href: '/styles.css' }
      ],
      scripts: [
        { type: 'text/javascript', src: '/node_modules/jquery/dist/jquery.js' },
        { type: 'text/javascript', src: '/node_modules/bootstrap/dist/js/bootstrap.min.js' },
        { type: 'text/javascript', src: '/node_modules/bootstrap-material-design/dist/js/material.js' },
        { type: 'text/javascript', src: '/node_modules/moment/min/moment.min.js' },
        { type: 'text/javascript', src: '/main.js' }
      ]
    }
  }
};
