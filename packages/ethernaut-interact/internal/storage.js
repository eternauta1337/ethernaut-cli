const fs = require('fs');
const path = require('path');

/**
 * addresses.json schema:
 * {
 *   "sepolia": {
 *      "0x1234567890123456789012345678901234567890": "ERC20",
 *      "0x1234567890123456789012345678901234567891": "Ethernaut",
 *    },
 * }
 */

function rememberAbiAndAddress(name, address, network) {
  initStorage();

  const addresses = readAddresses();

  if (!addresses[network]) {
    addresses[network] = {};
  }

  addresses[network][address] = name;

  storeAddresses(addresses);
}

function readAddresses() {
  return JSON.parse(fs.readFileSync(getAddressesFilePath(), 'utf8'));
}

function storeAddresses(data) {
  fs.writeFileSync(getAddressesFilePath(), JSON.stringify(data, null, 2));
}

function getAddressesFilePath() {
  return path.join(process.cwd(), 'artifacts', 'addresses.json');
}

function storeAbi(name, abi) {
  initStorage();

  const filePath = path.join(
    process.cwd(),
    'artifacts',
    'abis',
    `${name}.json`
  );

  fs.writeFileSync(filePath, JSON.stringify(abi, null, 2));
}

function initStorage() {
  // Create folders if they don't exist
  const dirPath = path.join(process.cwd(), 'artifacts', 'abis');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Crreate addresses.json if it doesn't exist
  const addressesPath = path.join(process.cwd(), 'artifacts', 'addresses.json');
  fs.writeFileSync(addressesPath, JSON.stringify({}, null, 2));
}

module.exports = {
  storeAbi,
  rememberAbiAndAddress,
};
