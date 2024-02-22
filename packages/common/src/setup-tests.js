const path = require('path');
const output = require('common/src/output');
const spinner = require('common/src/spinner');

async function setup() {
  output.mute(true);
  spinner.mute(true);

  loadHre();
}

function loadHre() {
  process.chdir(
    path.join(process.cwd(), 'test', 'fixture-projects', 'basic-project')
  );

  global.hre = require('hardhat');
}

setup();
