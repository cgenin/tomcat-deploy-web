const express = require('express');
const deploydb = require('../deploydb');
const logger = require('../logger');
const backup = require('../backup');
const router = express.Router();
const bodyParser = require('body-parser');
const DeployManager = require('../actions/deploy-manager');

const getArtifacts = function () {
  const items = deploydb.files() || {data: []};
  return items.data.map(d => {
    if (!d.job) {
      return Object.assign({}, d, {job: d.name});
    }
    return d;
  });
};

module.exports = (io) => {
  /**
   * @api {get} /artifact Get all artifacts
   * @apiName GetArtifact
   * @apiGroup Artifact
   *
   * @apiSuccess {Object[]} artifacts              an Array of Artifacts.
   * @apiSuccess {Number}   artifacts.loki         The Id Artifact.
   * @apiSuccess {Object}   artifacts.deployStates The last deployement.
   * @apiSuccess {String}   artifacts.url          The Url for download the war.
   * @apiSuccess {String}   artifacts.groupId      The group Id in the maven repository.
   * @apiSuccess {String}   artifacts.artifactId   The artifact Id in the maven repository.
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   * [
   *  {
   *    "name":"test24",
   *    "url":"http://localhost:5000/war/webapp-test.war",
   *    "groupId":"",
   *    "artifactId":"",
   *    "$loki":1,
   *    "deployStates":{
   *      "localhost:8080":
   *        {"state":"OK","dt":"2017-10-23T05:58:01.692Z"}
   *    }
   *   },
   *   ...
   *  ]
   */
  router.get('/', (req, res) => {
    const artifacts = getArtifacts();
    res.json(artifacts);
  });

  /**
   * @api {post} /artifact Create or Update an artifact
   * @apiName CreateOrUpdateArtifact
   * @apiGroup Artifact
   *
   * @apiParam {String} name Name of the artifact.
   * @apiParam {String} url The Url for download the war.
   * @apiParam {String} groupId The group Id in the maven repository.
   * @apiParam {String} artifactId The artifact Id in the maven repository.
   * @apiParamExample {json} Request-Example:
   * {
   *  "name":"The war name",
   *  "url":"http://localhost:5000/war/webapp-test.war",
   *  "groupId":"net.christophe.genin.test.war",
   *  "artifactId":"mywar"
   *  }
   * @apiSuccess {Object[]} artifacts The created Artifact.*
   * @apiSuccess {Number} artifacts.loki The created Artifact.
   * @apiSuccess {Object} artifacts.deployStates The last deployement.
   * @apiSuccess {String} artifacts.url The Url for download the war.
   * @apiSuccess {String} artifacts.groupId The group Id in the maven repository.
   * @apiSuccess {String} artifacts.artifactId The artifact Id in the maven repository.
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *
   * [
   *  {
   *    "name":"test24",
   *    "url":"http://localhost:5000/war/webapp-test.war",
   *    "groupId":"",
   *    "artifactId":"",
   *    "$loki":1,
   *    "deployStates":{
   *      "localhost:8080":
   *        {"state":"OK","dt":"2017-10-23T05:58:01.692Z"}
   *    }
   *   },
   *   ...
   * ]
   */
  router.post('/', bodyParser.json(), (req, res) => {
    const artifact = req.body;
    const files = deploydb.files();
    artifact.url = (artifact.url.indexOf('http://') === -1) ? `http://${artifact.url}` : artifact.url;
    deploydb.save(files, artifact);
    res.json(deploydb.files().data);
  });

  /**
   * @api {delete} /artifact/last/:nb Delete the backup files
   * @apiName DeleteBackupWar
   * @apiGroup Artifact
   * @apiParam {Number} nb The Number of war files to keep.
   *
   * @apiSuccess {Object}   artifacts The list of Artifacts Name keep after the clean.
   * @apiSuccess {Object[]} artifacts.wars The list of keeping war File.
   * @apiSuccess {String} artifacts.wars.f The filename.
   * @apiSuccess {String} artifacts.wars.name The artifact name.
   * @apiSuccess {Number} artifacts.wars.dt  The date of the deployed war in milliseconds.
   * @apiSuccess {Date}   artifacts.wars.date The date of the deployed war in Utc String.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *
   * {
   *    "test":[
   *      {
   *        "f":"test.war",
   *        "name":"test",
   *        "dt":1509622234000,
   *        "date":"2017-11-02T11:30:34.000Z"
   *       },
   *       ...
   *    ],
   *  ...
   *  }
   *
   */
  router.delete('/last/:nb', (req, res) => {
    const nb = req.params.nb;
    backup.clean(nb)
      .subscribe((i) => {
        res.json(i);
        io.sockets.emit('snackbar', {});
      }, err => {
        logger.error(err);
        res.json(backup.data())
      });

  });


  /**
   * @api {delete} /artifact Delete an specific artifact
   * @apiName DeleteArtifact
   * @apiGroup Artifact
   * @apiParam {Object} artifact The artifact to delete.
   *
   * @apiSuccess {Object}   artifacts The list of Artifacts which are kept after the remove operation.
   * @apiSuccess {Object[]} artifacts.wars The list of keeping war File.
   * @apiSuccess {String} artifacts.wars.f The filename.
   * @apiSuccess {String} artifacts.wars.name The artifact name.
   * @apiSuccess {Number} artifacts.wars.dt  The date of the deployed war in milliseconds.
   * @apiSuccess {Date}   artifacts.wars.date The date of the deployed war in Utc String.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *
   * {
   *    "test":[
   *      {
   *        "f":"test.war",
   *        "name":"test",
   *        "dt":1509622234000,
   *        "date":"2017-11-02T11:30:34.000Z"
   *       },
   *       ...
   *    ],
   *  ...
   *  }
   *
   */
  router.delete('/', bodyParser.json(), (req, res) => {
    const body = req.body;
    const files = deploydb.files();
    deploydb.remove(files, body);
    res.json(deploydb.files().data);
  });

  const retreiveServer = (serverName) => {
    const config = deploydb.config() || {data: [{}]};
    const servers = Array.from(config.data);
    return servers.find((s) => {
      return JSON.stringify(s).indexOf(serverName) !== -1;
    });
  };

  const retreiveArtifactByJob = (job) => {
    const artifacts = getArtifacts();
    return artifacts.find((a) => {
      const s = a.job || a.name;
      return s === job;
    });
  };

  /**
   * @api {put} /artifact/on/server/:serverName deploy one artifact on an specific server.
   * The artifact can be take from maven or by an specific job.
   * @apiName DeployArtifact
   * @apiGroup Artifact
   *
   * @apiParam {String} serverName Name of the .
   * @apiParam {String} groupId The group Id in the maven repository. required for maven deploy.
   * @apiParam {String} artifactId The artifact Id in the maven repository. required for maven deploy.
   * @apiParam {String} version The artifact version in the maven repository. if omitted, the latest version will be used.
   * @apiParam {String} job The artifact job configured in tomcat web deploy.
   *
   * @apiParamExample {json} Request-Example  for maven deploy:
   * {
   *  "groupId":"net.christophe.genin.test.war",
   *  "artifactId":"mywar"
   *  }
   * @apiParamExample {json} Request-Example  for url deploy:
   * {
   *  "job":"my name"
   *  }
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 204 OK
   *
   */
  router.put('/on/server/:serverName', bodyParser.json(), (req, res) => {
    const body = req.body;
    const ip = req._remoteAddress || 'unknown';
    const serverName = req.params.serverName;

    // Search for server
    const server = retreiveServer(serverName);
    if (!server) {
      res.status(404);
      res.json({message: 'Server not found'});
      return;
    }
    const {artifactId, groupId, job} = body;
    // Cas d'un demande déploiement par nexus;
    if (artifactId && groupId) {
      new DeployManager(ip)
        .deployByNexus(server, body)
        .then(() => {
          res.status(204);
          res.json();
        })
        .catch(() => {
          res.status(500);
          res.json({});
        });
      return;
    }
    // Cas d'une demande par url
    const artifact = retreiveArtifactByJob(job);
    if (!artifact) {
      res.status(404);
      res.json({message: 'Artifact not found'});
      return;
    }
    new DeployManager(ip)
      .deployByUrl(server, [artifact])
      .subscribe(() => {
          res.status(204);
          res.json();
        },
        () => {
          res.status(500);
          res.json({});
        });
  });

  return router;
};
