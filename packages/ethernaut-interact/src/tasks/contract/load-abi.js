const fs = require('fs');

module.exports = function loadAbi(abi) {
  if (!abi) return undefined;

  return JSON.parse(fs.readFileSync(abi, 'utf8'));
};
