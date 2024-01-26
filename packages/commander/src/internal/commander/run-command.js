const { spawn } = require('child_process');
const chalk = require('chalk');

async function runCommand(name, args, opts) {
  // console.log('Running command:', name, args, opts);

  let optStrings = [];
  Object.keys(opts).forEach((key) => {
    optStrings.push(`--${key}`);
    optStrings.push(opts[key]);
  });

  let output = '';
  function processOutput(data) {
    const str = data.toString();

    // Show the output to the user
    process.stdout.write(chalk.italic.dim(str));

    // Keep track of the total output
    output += str;
  }

  return new Promise((resolve) => {
    const tokens = ['./ethernaut', [name, ...args, ...optStrings]];
    // console.log('Tokens:', tokens);
    console.log(
      chalk.bgMagenta.italic('Running command:', `"${tokens[1].join(' ')}"`)
    );

    const child = spawn(...tokens);

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
  runCommand,
};
