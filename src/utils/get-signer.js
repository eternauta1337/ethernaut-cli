const hre = require('hardhat');

async function getSigner(number) {
  const accounts = await hre.ethers.getSigners();
  return accounts[number];
}

module.exports = {
  getSigner,
};
