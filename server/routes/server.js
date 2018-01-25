const express = require('express');
const deploydb = require('../deploydb');
const war = require('../war-manager');
const router = express.Router();
const bodyParser = require('body-parser');

/**
 * @api {get} /server Get all servers
 * @apiName FindServer
 * @apiGroup Server
 *
 * @apiSuccess {Object[]} servers               An Array of servers.
 * @apiSuccess {Number}   servers.id            The Id Server.
 * @apiSuccess {String}   servers.host          The hostname with formet 'hostanme:port'.
 * @apiSuccess {String}   servers.username      The username of the user which is authorized to deploy.
 * @apiSuccess {String}   servers.password      The password of the user which is authorized to deploy..
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  [
 *    {
 *      "host":"localhost:8080",
 *      "name":"local",
 *      "username":"tomcat",
 *      "password":"s3cret",
 *      "id":1
 *     },
 *   ...
 *  ]
 */
router.get('/', (req, res) => {
  const config = deploydb.config() || {data: [{}]};
  const data = Array.from(config.data);
  res.json(data.map(d => {
    const tmp = Object.assign({}, d);
    tmp.id = tmp.$loki;
    return tmp;
  }));
});

/**
 * @api {post} /server/auth?host=:host&username=:username&password=:pwd Test the server availability and if the credential are correct
 * @apiName TestServer
 * @apiGroup Server
 * @apiParam {String}   host          The hostname with formet 'hostanme:port'.
 * @apiParam {String}   username      The username of the user which is authorized to deploy.
 * @apiParam {String}   password      The password of the user which is authorized to deploy..

 * @apiSuccess {Number}   status            The http code result of the test.
 * @apiSuccess {String}   body          The response's text.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    {
 *      body : "OK - Applications listées pour l'hôte virtuel ..."
 *      status : 200
 *     }
 */
router.get('/auth', (req, res) => {
  const host = req.query.host;
  const username = req.query.username;
  const password = req.query.password;
  war.test(host, username, password)
    .subscribe(
      (d) => res.json(d), (e) => res.json(e));
});

/**
 * @api {post} /server Save Or Update an server properties
 * @apiName SaveOrUpdateServer
 * @apiGroup Server
 * @apiParam {Number}   id            The Id Server.
 * @apiParam {String}   host          The hostname with formet 'hostanme:port'.
 * @apiParam {String}   username      The username of the user which is authorized to deploy.
 * @apiParam {String}   password      The password of the user which is authorized to deploy..

 *
 * @apiSuccess {Object[]} servers               The new server's list.
 * @apiSuccess {Number}   servers.id            The Id Server.
 * @apiSuccess {String}   servers.host          The hostname with formet 'hostanme:port'.
 * @apiSuccess {String}   servers.username      The username of the user which is authorized to deploy.
 * @apiSuccess {String}   servers.password      The password of the user which is authorized to deploy..
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  [
 *    {
 *      "host":"localhost:8080",
 *      "name":"local",
 *      "username":"tomcat",
 *      "password":"s3cret",
 *      "id":1
 *     },
 *   ...
 *  ]
 */
router.post('/', bodyParser.json(), (req, res) => {
  const body = req.body;
  const config = deploydb.config();
  deploydb.save(config, body);
  res.json(body);
});


/**
 * @api {delete} /server Remove an server.
 * @apiName DeleteServer
 * @apiGroup Server
 * @apiParam {Number}   id            The Id Server.
 * @apiParam {String}   host          The hostname with formet 'hostanme:port'.
 * @apiParam {String}   username      The username of the user which is authorized to deploy.
 * @apiParam {String}   password      The password of the user which is authorized to deploy..

 *
 * @apiSuccess {Object[]} servers               The new server's list.
 * @apiSuccess {Number}   servers.id            The Id Server.
 * @apiSuccess {String}   servers.host          The hostname with formet 'hostanme:port'.
 * @apiSuccess {String}   servers.username      The username of the user which is authorized to deploy.
 * @apiSuccess {String}   servers.password      The password of the user which is authorized to deploy..
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *  [
 *    {
 *      "host":"localhost:8080",
 *      "name":"local",
 *      "username":"tomcat",
 *      "password":"s3cret",
 *      "id":1
 *     },
 *   ...
 *  ]
 */
router.delete('/', bodyParser.json(), (req, res) => {
  const body = req.body;
  const files = deploydb.config();
  deploydb.remove(files, body);
  res.json(deploydb.config().data);
});

module.exports = router;
