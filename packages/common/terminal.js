const pty = require('node-pty');
const os = require('os');

const ansiEscapeCodesPattern = /\x1B\[[0-?]*[ -/]*[@-~]/g;

const keys = {
  DOWN: '\x1B\x5B\x42',
  UP: '\x1B\x5B\x41',
  RIGHT: '\x1B\x5B\x43',
  LEFT: '\x1B\x5B\x44',
  ENTER: '\r',
};

class Terminal {
  constructor() {
    this.history = '';
    this.output = '';

    const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

    this.process = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: process.env.HOME,
      env: process.env,
    });

    this.process.on('data', (data) => {
      const txt = this.stripAnsi(data.toString());
      this.history += txt;
      this.output += txt;
    });
  }

  async run(command, wait) {
    this._write(`${command}\r`);
    return this.wait(wait);
  }

  async input(command, wait) {
    this._write(command);
    return this.wait(wait);
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
