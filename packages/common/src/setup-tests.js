const path = require('path');
const output = require('common/src/output');
const spinner = require('common/src/spinner');

async function muteOutput() {
  output.mute(true);
  spinner.mute(true);
}

function loadProject(projectName = 'basic-project') {
  const currentPath = process.cwd();
  const projectPath = path.join(process.cwd(), projectName);

  if (currentPath !== projectPath) {
    process.chdir(projectPath);
  }

  global.hre = require('hardhat');
}

module.exports = {
  muteOutput,
  loadProject,
};
