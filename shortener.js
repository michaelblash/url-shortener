

var db = {
  '12345': 'https://nodejs.org/'
};

exports.shorten = function(longURL, callback) {
  var short = Math.floor(Math.random() * 1000000).toString(36);
  db[short] = longURL;
  callback(null, short);
};

exports.resolve = function(shortURL, callback) {
  try {
    callback(null, db[shortURL]);
  } catch (e) {
    callback(e);
  }
};
