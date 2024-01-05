const hre = require('hardhat');
const { getSigner } = require('../utils/get-signer');

async function createInstance() {
  const signer = await getSigner(0);

  const helloEthernaut = await hre.ethers.deployContract(
    'HelloEthernaut',
    ['ethernaut0'],
    signer
  );

  return helloEthernaut;
}

function info() {
  return "Learn how to interact with the contract's info function";
}

async function validateInstance(helloEthernaut) {
  return await helloEthernaut.getCleared();
}

module.exports = {
  info,
  createInstance,
  validateInstance,
};
