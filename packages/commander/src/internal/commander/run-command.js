const { spawn } = require('child_process');

async function runCommand(name, args, opts) {
  console.log('Running command:', name, args, opts);

  let optStrings = [];
  Object.keys(opts).forEach((key) => {
    optStrings.push(`--${key}`);
    optStrings.push(opts[key]);
  });

  let output = '';
  function processOutput(data) {
    const str = data.toString();

    // Show the output to the user
    console.log(str);

    // Keep track of the total output
    output += str;
  }

  return new Promise((resolve) => {
    const tokens = ['./ethernaut', [name, ...args, ...optStrings]];
    console.log('Tokens:', tokens);

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
