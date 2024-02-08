const storage = require('../../internal/storage');

module.exports = async function prompt({ abiPath, hre }) {
  if (!abiPath) return;

  try {
    const network = hre.network.config.name || hre.network.name;

    return storage.findAddressWithAbi(abiPath, network);
  } catch (err) {
    debug.log(err);
  }
};
