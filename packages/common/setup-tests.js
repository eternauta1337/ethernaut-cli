const path = require('path');
const output = require('common/output');

async function setup() {
  output.mute(true);

  loadHre();
}

function loadHre() {
  process.chdir(
    path.join(process.cwd(), 'test', 'fixture-projects', 'basic-project')
  );

  global.hre = require('hardhat');
}

setup();
