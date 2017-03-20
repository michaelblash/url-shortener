/**
 * NOT FOR PRODUCTION!!!
 * For production use some other module that implements
 * proper database work. This one is only for demo purposes
 * to make the development easier.
 */

var HashTable = require('./lib/hash_table');
var ht = new HashTable();

exports.shorten = function(longURL, callback) {
  var short = ht.push(longURL);
  if (short) callback(null, short);
  else callback(new Error('The database is full.'));
};

exports.resolve = function(shortURL, callback) {
  var longURL = ht.get(shortURL);
  if (longURL) callback(null, longURL);
  else callback(new Error('No value for ' + shortURL + ' key'));
};