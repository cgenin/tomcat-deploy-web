'use strict';
const path = require('path');

module.exports = {
  app: {
    name: 'Tomcat - Deploy - Web',
    title: 'Tomcat - Deploy - Web'
  },
  downloadedDir: 'download',
  server: {
    port: 5000
  },
  folders: {
    build: path.join(__dirname, '../../../public'),
    css: path.join(__dirname, '../../../public/css'),
    fontsSrc: [
      path.join(__dirname, '../../..//node_modules/bootstrap/dist/fonts'),
      path.join(__dirname, '../../..//node_modules/font-awesome/fonts')
    ],
    fontsBuild: path.join(__dirname, '../../../public/fonts')
  },
  build: {},
  services: {
    html: {
      links: [
        {rel: 'stylesheet', type: 'text/css', href: '/css/bundle.css'}
      ],
      scripts: [
        {type: 'text/javascript', src: '/socket.io/socket.io.js'},
        {type: 'text/javascript', src: '/main.js'}
      ]
    }
  }
};
