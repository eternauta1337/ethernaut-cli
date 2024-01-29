const { spawn } = require('child_process');
const chalk = require('chalk');

function parseCommand(name, args, opts) {
  let optStrings = [];

  Object.keys(opts).forEach((key) => {
    optStrings.push(`--${key}`);
    optStrings.push(opts[key]);
  });

  return [name, ...args, ...optStrings];
}

async function runCommand(tokens) {
  const allTokens = ['./ethernaut', tokens];

  let output = '';
  function processOutput(data) {
    const str = data.toString();

    // Show the output to the user
    process.stdout.write(chalk.italic.dim(str));

    // Keep track of the total output
    output += str;
  }

  return new Promise((resolve) => {
    const child = spawn(...allTokens);

    child.stdout.on('data', (data) => {
      processOutput(data);
    });

    child.stderr.on('data', (data) => {
      processOutput(data);
    });

    child.on('exit', () => {
      resolve(output);
    });
  });
}

module.exports = {
  parseCommand,
  runCommand,
};
