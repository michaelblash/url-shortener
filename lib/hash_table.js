module.exports = HashTable;

var INT32 = 0xffffffff;

/**
 * This class implements a primitive in-memory hash table.
 * The max size of the table is 2^32 (4294967296 in decimal).
 * The keys are basically short strings containing from 5 to 7
 * characters of the range defined by [a-z0-9] RegExp pattern. 
 * @class HashTable
 * @constructor
 */
function HashTable() {

  var table = {},
      length = 0,
      salt = Math.floor(Math.random() * INT32);
  /**
   * Insert the value into hash table
   *
   * @method push
   * @param {String} value Input string to be hashed
   * @return {String} Hash key of the value inserted in the table
   */
  this.push = function(value) {
    var i,
        hashKey,
        hashInt = getHash(value, salt);

    for (i = 0; i < Number(INT32); i++) {
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
  /**
   * Get the value by hash key
   *
   * @method get
   * @param {String} key Key by which the search is conducted
   * @return {string} The value located by the specified key
   */
  this.get = function(key) {
    return table[key];
  };
  /**
   * Number of items in hash table
   * @property length
   * @type Number
   */
  Object.defineProperty(this, 'length', {
    get: function() { return length; },
    enumerable: false,
    configurable: false
  });

}

/**
 * Transform a string to a 32-bit integer value
 * using simple XOR convertion
 * 
 * @param {String} str Input string to be hashed
 * @param {Number} [salt] Initial hash value
 * return {Number} Hash value
 */
function getHash(str, salt) {
  var bufIndex,
      buf = Buffer.from(str),
      hashInt = !isNaN(salt) ? salt : 0;

  for (bufIndex = buf.length - 4; bufIndex >= 0; bufIndex -= 4) {
    hashInt ^= buf.readUInt32LE(bufIndex);
  }
  bufIndex += 4;
  if (bufIndex) {
    hashInt ^= buf.readUIntLE(0, bufIndex);
  }
  return hashInt;
}