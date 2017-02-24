var http = require('http');
var parse = require('url').parse;
var path = require('path');
var fs = require('fs');
var util = require('util');
var utils = require('./utils');

var quickRespose = utils.quickRespose;


module.exports = StaticServer;
module.exports.serveFileSafe = serveFileSafe;
module.exports.serveFile = serveFile;


function StaticServer(root) {
  return function(req, res) {
    serveFileSafe(path.join(root, parse(req.url).pathname), res);
  };
}

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
  console.log(filePath);
}

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
    // MIME TYPE?
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
