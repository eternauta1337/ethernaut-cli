const fs = require('fs');
const path = require('path');
const storage = require('../../internal/storage');
const similarity = require('string-similarity');
const debug = require('common/debug');

module.exports = function (abi) {
  // An abi is specified but its not a valid file.
  // Try to match it with a known file...
  if (abi && !isValidJsonFile(abi)) {
    const abis = storage.readAbiFiles();
    // const match = abis.find((a) =>
    //   a.name.toLowerCase().includes(abi.toLowerCase())
    // );
    const matches = similarity.findBestMatch(
      abi,
      abis.map((a) => a.name)
    );
    if (!matches) return;

    const match = abis.find((a) => a.name === matches.bestMatch.target);
    if (!match) return;

    debug.log(
      `Matched incoming ABI "${abi}" with known ABI "${match.path}"`,
      'interact'
    );

    return match.path;
  }
};

function isValidJsonFile(abi) {
  if (path.extname(abi) !== '.json') {
    return false;
  }

  if (!fs.existsSync(abi)) {
    return false;
  }

  return true;
}
