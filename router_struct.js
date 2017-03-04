var path = require('path');
var qs = require('querystring');
var staticServer = require('./lib/static_server.js');
var shortener = require('./shortener');

// Define a router structure with some templates
module.exports = function(config) {
  var routes = {
    GET: {
      '/': function(req, res) {
        staticServer.serveFile(path.join(config.rootPath, 'index.html'), res);
      },
      '/:short': function(req, res, short) {
        shortener.resolve(short, function(err, result) {
          if (err || !result) {
            staticServer.serveFileSafe('nothing', res);
            return;
          }
          res.setHeader('Content-Type', 'text/html; charset=UTF-8');
          res.end(result);
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
            res.end(config.domain + '/' + result);
          });
        });
      }
    }
  };

  routes.GET[
    path.normalize('/' + config.staticPrefix + '/::path')
    ] = function(req, res, filePath) {
    staticServer.serveFileSafe(path.join(config.rootPath, filePath), res);
  };

  return routes;
};
