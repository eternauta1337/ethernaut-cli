const pty = require('node-pty')
const os = require('os')
const debug = require('common/src/debug')

// eslint-disable-next-line no-control-regex
const ansiEscapeCodesPattern = /\x1B\[[0-?]*[ -/]*[@-~]/g

const keys = {
  DOWN: '\x1B\x5B\x42',
  UP: '\x1B\x5B\x41',
  RIGHT: '\x1B\x5B\x43',
  LEFT: '\x1B\x5B\x44',
  ENTER: '\r',
}

const doneTxt = '__terminal_done__'

class Terminal {
  constructor(cwd) {
    this.history = ''
    this.output = ''
    this.running = false

    const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash'

    this.process = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: cwd || process.cwd(),
      env: process.env,
    })

    this.process.onData((data) => {
      const txt = this.stripAnsi(data.toString())
      debug.log(`Terminal output: ${txt}`, 'terminal')
      this.history += txt
      this.output += txt
    })
  }

  async run(command, wait) {
    if (this.running) {
      throw new Error('Terminal is already running a command')
    }

    this.running = true
    debug.log(`Running command: ${command}`, 'terminal')

    // Attach doneTxt to the command so we can detect when it's done.
    this._write(`${command} && echo '${doneTxt}'\r`)

    const completion = this._waitForCompletion()
    const delay = this.wait(wait)
    await Promise.race([completion, delay])

    this.running = false
  }

  async input(command, wait) {
    this._write(command)
    return this.wait(wait)
  }

  _waitForCompletion() {
    // Attach a secondary event listener that only checks
    // for the doneTxt string.
    return new Promise((resolve) => {
      const listener = this.process.onData((data) => {
        if (data.includes(doneTxt) && !data.includes('echo')) {
          debug.log('Command completed', 'terminal')
          listener.dispose()
          resolve()
        }
      })
    })
  }

  _write(content) {
    this.output = ''
    this.process.write(content)
  }

  async wait(delay) {
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, delay)
    })
  }

  stripAnsi(inputString) {
    return inputString.replace(ansiEscapeCodesPattern, '')
  }
}

module.exports = { Terminal, keys }
