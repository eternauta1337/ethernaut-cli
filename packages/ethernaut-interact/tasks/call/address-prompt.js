const storage = require('../../internal/storage');

module.exports = async function prompt({ abiPath, hre }) {
  if (!abiPath) return;

  // Try to deduce the address from the abi
  const network = hre.network.config.name || hre.network.name;
  return storage.findAddressWithAbi(abiPath, network);
};
