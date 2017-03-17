var http = require('http');

exports.quickRespose = quickRespose;
exports.encodeURIByChar = encodeURIByChar;


/**
 * Send a response equiped with a default plain text.
 */
function quickRespose(res, status) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/plain');
  res.end(http.STATUS_CODES[res.statusCode]);
}

/**
 * Escapes each character in a @param str except for percentage signs.
 */
function encodeURIByChar(str) {
  var strArr = str.split('');
  strArr.forEach(function(v, i, a) {
    if (v != '%') a[i] = encodeURI(v);
  });
  return strArr.join('');
}