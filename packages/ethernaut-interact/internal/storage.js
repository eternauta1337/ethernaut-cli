const fs = require('fs');
const path = require('path');
const {
  createFolderIfMissing,
  createFileIfMissing,
} = require('common/create-file');

/**
 * addresses.json schema:
 * {
 *   "sepolia": {
 *      "0x1234567890123456789012345678901234567890": "ERC20",
 *      "0x1234567890123456789012345678901234567891": "Ethernaut",
 *    },
 * }
 */

function readAddresses() {
  initStorage();

  return JSON.parse(fs.readFileSync(getAddressesFilePath(), 'utf8'));
}

function storeAddresses(data) {
  initStorage();

  fs.writeFileSync(getAddressesFilePath(), JSON.stringify(data, null, 2));
}

function rememberAbiAndAddress(abiPath, address, network) {
  initStorage();

  const addresses = readAddresses();

  if (!addresses[network]) {
    addresses[network] = {};
  }

  addresses[network][address] = abiPath;

  storeAddresses(addresses);
}

function getAddressesFilePath() {
  return path.join(getInteractFilePath(), 'addresses.json');
}

function storeAbi(name, abi) {
  initStorage();

  const filePath = path.join(getAbisFilePath(), `${name}.json`);

  fs.writeFileSync(filePath, JSON.stringify(abi, null, 2));

  return filePath;
}

function getAbisFilePath() {
  return path.join(getInteractFilePath(), 'abis');
}

function getInteractFilePath() {
  return path.join(process.cwd(), 'artifacts', 'interact');
}

function initStorage() {
  createFolderIfMissing(getAbisFilePath());
  createFileIfMissing(getAddressesFilePath(), {});
}

function readAbiFiles() {
  initStorage();

  const abisPath = getAbisFilePath();

  return fs.readdirSync(abisPath).map((abiFile) => {
    return {
      name: abiFile.split('.json')[0],
      path: path.join(abisPath, abiFile),
    };
  });
}

module.exports = {
  storeAbi,
  rememberAbiAndAddress,
  readAddresses,
  readAbiFiles,
};
