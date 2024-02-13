const storage = require('../../internal/storage');
const debug = require('common/debug');
const path = require('path');
const loadAbi = require('./load-abi');

module.exports = async function ({ abi, hre }) {
  if (!abi) return;

  try {
    const network = hre.network.config.name || hre.network.name;

    debug.log(
      `Looking for addresses for ABI ${path.basename(abi)}`,
      'interact'
    );
    const addresses = storage.findAddressWithAbi(abi, network);
    debug.log(
      `Addresses used with ${path.basename(abi)}: ${addresses}`,
      'interact'
    );

    return addresses;
  } catch (err) {
    debug.log(err);
  }
};
