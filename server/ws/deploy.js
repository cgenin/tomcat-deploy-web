const deploydb = require('../deploydb');
const backup = require('../backup');
const rc = require('./RemoteConsole');
const DeployManager = require('../actions/deploy-manager');

module.exports = function (socket, io, ip) {

  rc.log('connected to server.');

  socket.emit('versions', backup.data());
  socket.on('artifact-clean', (nb) => backup.clean(nb).subscribe(v => io.sockets.emit('versions', v)));

  socket.on('undeploy', (data) => {
    const {server, artifacts} = data;
    new DeployManager(ip)
      .undeploy(server, artifacts);
  });


  socket.on('deploy-nexus', (data) => {
    const {nexus, server} = data;
    new DeployManager(ip)
      .deployByNexus(server, nexus);
  });

  socket.on('deploy', (data) => {
    const {versions, server, artifacts} = data;
    new DeployManager(ip)
      .deployByUrl(server, artifacts, versions)
      .subscribe(
        (o) => {
          socket.emit('replace-item', deploydb.updateStatus(deploydb.files(), o, 'OK', server.host));
          backup.load(o.name).subscribe((d) => io.sockets.emit('versions', d));
        });
  });
};
