const pty = require('node-pty')
const os = require('os')
const debug = require('common/src/debug')
const assert = require('assert')

// eslint-disable-next-line no-control-regex
const ansiEscapeCodesPattern = /\x1B\[[0-?]*[ -/]*[@-~]/g

const keys = {
  DOWN: '\x1B\x5B\x42',
  UP: '\x1B\x5B\x41',
  RIGHT: '\x1B\x5B\x43',
  LEFT: '\x1B\x5B\x44',
  ENTER: '\r',
  CTRLC: '\x03',
}

class Terminal {
  constructor() {
    this.history = ''
    this.output = ''
    this.shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash'
  }

  async run(command, wait = 10000) {
    if (this.running) {
      throw new Error('Terminal is already running a command')
    }

    this.process = pty.spawn(this.shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: process.cwd(),
      env: process.env,
    })

    if (this.listener) {
      this.listener.dispose()
    }

    this.listener = this.process.onData((data) => {
      const txt = this.stripAnsi(data.toString())
      this.history += txt
      this.output += txt
      debug.log(`Terminal output: ${txt}`, 'terminal')
    })

    this.running = true
    debug.log(`Running command: ${command}`, 'terminal')

    this._write(`${command} && sleep 1 && exit\r`)

    const completion = this._waitForCompletion()
    const delay = this.wait(wait)
    await Promise.race([completion, delay])

    this.running = false
  }

  async input(command, wait = 200) {
    this._write(command)
    return this.wait(wait)
  }

  _waitForCompletion() {
    return new Promise((resolve) => {
      this.process.onExit(() => {
        debug.log('Command completed', 'terminal')
        resolve()
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

  has(output) {
    assert.ok(this.output.includes(output), `Output: >${this.output}<`)
  }

  notHas(output) {
    assert.ok(!this.output.includes(output), `Output: >${this.output}`)
  }
}

module.exports = { Terminal, keys }
