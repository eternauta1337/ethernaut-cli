const storage = require('../../../internal/storage');
const debug = require('common/debug');

module.exports = async function autocompleteAddress({ abi, address, hre }) {
  if (!abi) return;

  if (address !== undefined) return;

  try {
    const network = hre.network.config.name || hre.network.name;

    debug.log(`Looking for addresses for ABI ${abi}`, 'interact');
    const addresses = storage.findAddressWithAbi(abi, network);
    debug.log(`Addresses used with ${abi}: ${addresses}`, 'interact');

    return addresses;
  } catch (err) {
    debug.log(err);
  }
};
