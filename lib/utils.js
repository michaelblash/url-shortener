var http = require('http');

exports.quickRespose = quickRespose;

function quickRespose(res, status) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/plain');
  res.end(http.STATUS_CODES[res.statusCode]);
}
