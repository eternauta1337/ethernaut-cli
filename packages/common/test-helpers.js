const path = require('path');
const output = require('./output');
const { resetHardhatContext } = require('hardhat/plugins-testing');

function useEnvironment(fixtureProjectName) {
  beforeEach('load hre on fixture project', function () {
    this.prevDir = process.cwd();

    process.chdir(
      path.join(process.cwd(), 'test', 'fixture-projects', fixtureProjectName)
    );

    this.hre = require('hardhat');
  });

  afterEach('reset hre', function () {
    process.chdir(this.prevDir);
    resetHardhatContext();
  });
}

function collectOutput() {
  let outputBuffer = { content: '' };

  output.mute(true);

  beforeEach('start collecting output', () => {
    output.startCollectingOutput(outputBuffer);
  });

  afterEach('Resetting hardhat', function () {
    output.stopCollectingOutput();
  });

  return () => outputBuffer.content.trim();
}

module.exports = {
  useEnvironment,
  collectOutput,
};
