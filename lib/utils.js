var http = require('http');

exports.quickRespose = quickRespose;

/**
 * Send a response equiped with a default plain text.
 */

function quickRespose(res, status) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/plain');
  res.end(http.STATUS_CODES[res.statusCode]);
}
