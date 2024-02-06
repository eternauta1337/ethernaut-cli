const loadAbi = require('./load-abi');
const storage = require('../../internal/storage');

module.exports = async function prompt({ abiPath, hre }) {
  const abi = loadAbi(abiPath);
  if (!abi) return;

  const network = hre.network.config.name || hre.network.name;
  const addresses = storage.readAddresses()[network];

  Object.entries(addresses).forEach(([address, addressAbiPath]) => {
    if (addressAbiPath === addressAbiPath) {
      return address;
    }
  });
};
