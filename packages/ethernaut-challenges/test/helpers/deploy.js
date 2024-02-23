const fs = require('fs');
const path = require('path');
const helper = require('../../src/internal/helper');

let hre;

module.exports = async function deploy(_hre) {
  hre = _hre;

  const network = hre.network.name;

  // console.log(`Deploying ethernaut in the ${network} network...`);

  // Deploy the main game contract
  const ethernaut = await deployEthernaut();

  // Connect the stats to the main contract
  await deployStats(ethernaut);

  // Deploy the levels needed in the tests
  // Note: Make sure that the associated level factory
  // contract is included in Imports.sol (or one of the import files),
  // and that the level address is reported in the deploymentInfo object below
  const level1 = await deployLevel(1, ethernaut);
  const level2 = await deployLevel(2, ethernaut);
  const level3 = await deployLevel(3, ethernaut);

  // Build the deployment info obj
  const deploymentInfo = {
    0: await level1.getAddress(),
    1: await level2.getAddress(),
    2: await level3.getAddress(),
    ethernaut: await ethernaut.getAddress(),
  };

  // Write it to disk
  fs.writeFileSync(
    path.join(helper.getGamedataPath(), `deploy.${network}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );
};

async function deployEthernaut() {
  const Ethernaut = await hre.ethers.getContractFactory('Ethernaut');

  return await Ethernaut.deploy();
}

async function deployStats(ethernaut) {
  const Stats = await hre.ethers.getContractFactory('Statistics');

  const stats = await Stats.deploy();

  let tx = await stats.initialize(await ethernaut.getAddress());
  await tx.wait();

  tx = await ethernaut.setStatistics(await stats.getAddress());
  await tx.wait();
}

async function deployLevel(levelNumber, ethernaut) {
  const gamedata = helper.getGamedata();
  const leveldata = gamedata.levels[levelNumber - 1];
  const levelFactoryName = leveldata.levelContract.split('.')[0];

  const Level = await hre.ethers.getContractFactory(levelFactoryName);

  const level = await Level.deploy();

  const tx = await ethernaut.registerLevel(await level.getAddress());
  await tx.wait();

  return level;
}
