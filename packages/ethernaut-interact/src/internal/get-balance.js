const hre = require('hardhat')

module.exports = async function getBalance(address) {
  return hre.ethers.formatEther(await hre.ethers.provider.getBalance(address))
}
