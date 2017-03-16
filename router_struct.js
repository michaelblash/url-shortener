var path = require('path');
var qs = require('querystring');
var staticServer = require('./lib/static_server.js');
var shortener = require('./shortener');
var utils = require('./lib/utils.js');

// Define a router structure with templates
module.exports = function(config) {
  var routes = {
    GET: {
      '/': function(req, res) {
        staticServer.serveFile(path.join(config.rootPath, 'index.html'), res);
      },
      '/:short': function(req, res, short) {
        shortener.resolve(short, function(err, result) {
          if (err || !result) {
            // send a 404 page since there is no file named 'nothing'
            staticServer.serveFileSafe('nothing', res);
            return;
          }
          res.statusCode = 303;
          res.setHeader('Location', utils.encodeURIByChar(result));
          res.end();
        });
      }
    },
    POST: {
      '/': function(req, res) {
        var body = '';
        req.setEncoding('utf8');
        req.on('data', function(chunk) { body += chunk; });
        req.on('end', function() {
          var obj = qs.parse(body);
          shortener.shorten(obj.url, function(err, result) {
          res.setHeader('connection', 'close');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(config.domain + '/' + result);
          });
        });
      }
    }
  };

  routes.GET[
    '/' + config.staticPrefix + '/::path'
    ] = function(req, res, filePath) {
    staticServer.serveFileSafe(path.join(config.rootPath, filePath), res);
  };

  return routes;
};