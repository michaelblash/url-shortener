var http = require('http');
var parse = require('url').parse;
var path = require('path');
var fs = require('fs');
var util = require('util');
var utils = require('./utils');

var quickRespose = utils.quickRespose;


exports.StaticServer = StaticServer;
exports.serveFileSafe = serveFileSafe;
exports.serveFile = serveFile;

/**
 * Return a static server handler to pass request and response
 * objects to. It handles request and send file as a response
 * if there is any by the path specified in request.url property.
 */

function StaticServer(root) {
  return function(req, res) {
    serveFileSafe(path.join(root, parse(req.url).pathname), res);
  };
}

/**
 * Send a file after performing all of necessary checks.
 * If @param filePath contains invalid or malicious path
 * the function sends 400 response.
 */

function serveFileSafe(filePath, res) {
  try {
    filePath = decodeURIComponent(filePath);
  } catch(e) {
    quickRespose(res, 400);
    return;
  }
  if (~filePath.indexOf('\0')) {
    quickRespose(res, 400);
    return;
  }
  filePath = filePath.replace(/\.+\//g, '/');
  filePath = path.normalize(filePath);

  serveFile(filePath, res);
}

/**
 * Send a file if there is one by the specified path.
 */

function serveFile(filePath, res) {
  fs.stat(filePath, function(err, stat) {
    if (err) {
      if (err.code == 'ENOENT')
        quickRespose(res, 404);
      else
        quickRespose(res, 500);
      return;
    }
    if (!stat.isFile()) {
      quickRespose(res, 404);
      return;
    }
    // Mime type determination is omitted deliberatelly
    // for the brevity's sake, lol
    res.setHeader('Content-Length', stat.size);
    var stream = fs.createReadStream(filePath);
    stream.pipe(res);
    stream.on('error', function(err) {
      quickRespose(res, 500);
    });
    res.on('close', function() {
      stream.destroy();
    });
  });
}
