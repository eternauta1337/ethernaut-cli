const fs = require('fs');
const path = require('path');

function getGamedata() {
  const filePath = path.join(getGamedataFolderPath(), 'gamedata.json');

  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getDeploymentInfo() {
  const filePath = path.join(getGamedataFolderPath(), 'deploy.sepolia.json');

  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getLevelDescription(descriptionFileName) {
  const filePath = path.join(
    getGamedataFolderPath(),
    'en',
    'descriptions',
    'levels',
    descriptionFileName
  );

  return fs.readFileSync(filePath, 'utf8');
}

function getGamedataFolderPath() {
  return path.join(__dirname, '..', 'extracted', 'gamedata');
}

function getEthernautAbi() {
  const filePath = path.join(
    __dirname,
    '..',
    'extracted',
    'abis',
    'Ethernaut.json'
  );

  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

module.exports = {
  getGamedata,
  getDeploymentInfo,
  getLevelDescription,
  getGamedataFolderPath,
  getEthernautAbi,
};
