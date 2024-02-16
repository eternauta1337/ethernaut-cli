const fs = require('fs');
const path = require('path');

function getGamedata() {
  const filePath = path.join(getGamedataPath(), 'gamedata.json');

  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getDeploymentInfo() {
  const filePath = path.join(getGamedataPath(), 'deploy.sepolia.json');

  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getLevelDescription(descriptionFileName) {
  const filePath = path.join(
    getGamedataPath(),
    'en',
    'descriptions',
    'levels',
    descriptionFileName
  );

  return fs.readFileSync(filePath, 'utf8');
}

function getEthernautAbi() {
  const filePath = path.join(getAbisPath(), 'Ethernaut.json');

  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getAbi(abiName) {
  const filePath = path.join(getAbisPath(), `${abiName}.json`);

  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// ------------------------
// Paths
// ------------------------

function getExtractedFilesPath() {
  return path.join(__dirname, '..', '..', 'extracted');
}

function getAbisPath() {
  return path.join(process.cwd(), 'artifacts', 'interact', 'abis');
}

function getSourcesPath() {
  return path.join(getExtractedFilesPath(), 'contracts');
}

function getGamedataPath() {
  return path.join(__dirname, '..', '..', 'extracted', 'gamedata');
}

module.exports = {
  getGamedata,
  getDeploymentInfo,
  getLevelDescription,
  getGamedataPath,
  getAbisPath,
  getSourcesPath,
  getEthernautAbi,
  getAbi,
};
