var http = require('http');

exports.quickRespose = quickRespose;

function quickRespose(res, status) {
  res.statusCode = status;
  res.end(http.STATUS_CODES[res.statusCode]);
}
