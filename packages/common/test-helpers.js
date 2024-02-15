const path = require('path');
const output = require('./output');
const { resetHardhatContext } = require('hardhat/plugins-testing');

function useEnvironment(fixtureProjectName) {
  let hre;

  before('load hre on fixture project', () => {
    this.prevDir = process.cwd();

    process.chdir(
      path.join(process.cwd(), 'test', 'fixture-projects', fixtureProjectName)
    );

    hre = require('hardhat');
  });

  after('reset hre', () => {
    process.chdir(this.prevDir);
    resetHardhatContext();
  });

  return () => hre;
}

function collectOutput() {
  output.mute(true);

  let outputBuffer = { content: '' };

  before('start collecting output', () => {
    output.startCollectingOutput(outputBuffer);
  });

  after('Resetting hardhat', () => {
    output.stopCollectingOutput();
  });

  return () => outputBuffer.content.trim();
}

function extractLine(text, lineStart) {
  // Escape special characters in the lineStart string to safely use it in a regular expression
  const escapedLineStart = lineStart.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

  // Construct a dynamic regular expression using the escaped lineStart
  // The 'm' flag is used to perform multiline matching
  const regex = new RegExp(`^${escapedLineStart}(.*)$`, 'm');

  const match = text.match(regex);

  // If a match is found, return the captured group, trimmed of whitespace
  if (match) {
    return match[1].trim();
  } else {
    throw new Error(`Line starting with "${lineStart}" not found`);
  }
}

module.exports = {
  useEnvironment,
  collectOutput,
  extractLine,
};
