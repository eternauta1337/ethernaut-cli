const pty = require('node-pty');
const os = require('os');
const debug = require('common/debug');

const ansiEscapeCodesPattern = /\x1B\[[0-?]*[ -/]*[@-~]/g;

const keys = {
  DOWN: '\x1B\x5B\x42',
  UP: '\x1B\x5B\x41',
  RIGHT: '\x1B\x5B\x43',
  LEFT: '\x1B\x5B\x44',
  ENTER: '\r',
};

class Terminal {
  constructor(cwd) {
    this.history = '';
    this.output = '';

    const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

    this.process = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: cwd || process.cwd(),
      env: process.env,
    });

    this.process.onData((data) => {
      const txt = this.stripAnsi(data.toString());
      debug.log(txt, 'terminal');
      this.history += txt;
      this.output += txt;
    });
  }

  async run(command, wait) {
    debug.log(`Running command: ${command}`, 'terminal');

    this._write(`${command}\r`);

    // Wait for the command to complete or the delay to expire,
    // whichever happens first.
    // Note: for completion to actually work, onclude '&& exit' in the command.
    const completion = this._waitForCompletion();
    const delay = this.wait(wait);
    return await Promise.race([completion, delay]);
  }

  async input(command, wait) {
    this._write(command);
    return this.wait(wait);
  }

  _waitForCompletion() {
    return new Promise((resolve) => {
      this.process.once('exit', () => {
        debug.log('Process exited', 'terminal');
        resolve();
      });
    });
  }

  _write(content) {
    this.output = '';
    this.process.write(content);
  }

  async wait(delay) {
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, delay);
    });
  }

  stripAnsi(inputString) {
    return inputString.replace(ansiEscapeCodesPattern, '');
  }
}

module.exports = { Terminal, keys };
