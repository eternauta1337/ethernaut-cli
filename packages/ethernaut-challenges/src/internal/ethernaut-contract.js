const helper = require('./helper');
const getNetwork = require('common/network');

module.exports = async function getEthernautContract(hre) {
  const network = getNetwork(hre);

  // Get the game address
  const deploymentInfo = helper.getDeploymentInfo(network);
  const gameAddress = deploymentInfo.ethernaut;

  // Get the abi and create the contract instance
  const abi = helper.getEthernautAbi();
  const ethernaut = await hre.ethers.getContractAt(abi, gameAddress);

  // Check if there is code at the game address
  const code = await hre.ethers.provider.getCode(gameAddress);
  if (code === '0x') {
    throw new Error('No code at the game address');
  }

  return ethernaut;
};
