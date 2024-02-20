// const mockStdio = require('mock-stdio');
const assert = require('assert');
const pty = require('node-pty');
const os = require('os');
const ansiEscapes = require('ansi-escapes');

const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

function stripAnsi(inputString) {
  // Regular expression to match ANSI escape codes
  const ansiEscapeCodesPattern = /\x1B\[[0-?]*[ -/]*[@-~]/g;
  // Replace ANSI escape codes with an empty string
  return inputString.replace(ansiEscapeCodesPattern, '');
}

describe('navigate', function () {
  let result = '';

  before('run something', async function () {
    const ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: process.env.HOME,
      env: process.env,
    });

    ptyProcess.on('data', function (data) {
      result += stripAnsi(data.toString());
    });

    // Open navigation
    ptyProcess.write('ethernaut navigate\r');

    // Wait a bit and interact with the prompt
    setTimeout(() => {
      // Down arrow key x2
      ptyProcess.write(ansiEscapes.cursorDown());
      ptyProcess.write(ansiEscapes.cursorDown());

      // Simulate pressing Enter shortly after
      setTimeout(() => {
        ptyProcess.write('\r');
      }, 200);
    }, 500); //

    // Wait 1s
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  it('xxx', async function () {
    // Show output
    console.log(`>${result}<`);
  });
});
