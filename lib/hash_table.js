/**
 * This class implements a primitive in-memory hash table.
 * The max size of the table is 2^32 (4294967296 in decimal).
 * The keys are basically short strings containing from 5 to 7
 * characters of the range defined by [a-z0-9] RegExp pattern.
 */

module.exports = HashTable;

var INT32 = 0xffffffff;

function HashTable() {

  var table = {};
  var length = 0;
  var salt = Math.floor(Math.random() * INT32);

  this.push = function(value) {
    var hashInt = getHash(value, salt);
    var hashKey;
    for (var i = 0; i < Number(INT32); i++) {
      hashKey = hashInt.toString(36);
      if (!table[hashKey]) {
        table[hashKey] = value;
        length++;
        return hashKey;
      }
      if (table[hashKey] === value) return hashKey;
      hashInt = (hashInt + 1) % INT32;
    }
    return null;
  };

  this.get = function(key) {
    return table[key];
  };

  Object.defineProperty(this, "length", {
    get: function() { return length; },
    enumerable: false,
    configurable: false
  });

}

/**
 * Transform a string to a 32-bit integer value
 * used as a digest.
 * @private
 */
function getHash(str, salt) {
  var buf = Buffer.from(str);
  var hashInt = !isNaN(salt) ? salt : 0;
  for (var bufIndex = buf.length - 4; bufIndex >= 0; bufIndex -= 4) {
    hashInt ^= buf.readUInt32LE(bufIndex);
  }
  bufIndex += 4;
  if (bufIndex) {
    hashInt ^= buf.readUIntLE(0, bufIndex);
  }
  return hashInt;
}