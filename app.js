var http = require('http');
var router = require('./lib/router').Router;
var config = require('./config');

var root = __dirname + '/public';
config.rootPath = root;
var routes = require('./router_struct')(config);

var server = http.createServer(function(req, res) {
  router(routes)(req, res);
});

server.listen(config.port);
