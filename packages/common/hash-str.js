const crypto = require('crypto');

module.exports = function hashStr(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
};
