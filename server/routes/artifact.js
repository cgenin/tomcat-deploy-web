const express = require('express');
const deploydb = require('../deploydb');
const backup = require('../backup');
const router = express.Router();
const bodyParser = require('body-parser');

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
    const items = deploydb.files() || {data: []};
    res.json(items.data.map(d => {
      if (!d.job) {
        return Object.assign({}, d, {job: d.name});
      }
      return d;
    }));
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
    const tmpHttp = (artifact.url.indexOf('http://') === -1) ? `http://${artifact.url}` : artifact.url;
    artifact.url = tmpHttp;
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
        console.error(err);
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

  return router;
};
