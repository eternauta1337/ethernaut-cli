const fs = require('fs');

module.exports = function loadAbi(abiPath) {
  if (!abiPath) return undefined;

  return JSON.parse(fs.readFileSync(abiPath, 'utf8'));
};
