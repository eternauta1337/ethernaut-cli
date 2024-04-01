const pty = require('node-pty')
const os = require('os')
const debug = require('ethernaut-common/src/ui/debug')
const assert = require('assert')
const chalk = require('chalk')
const wait = require('ethernaut-common/src/util/wait')

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

  async run(command, delay = 10000) {
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

    const c = command.replace('hardhat', 'nyc hardhat')
    this._write(`${c} && sleep 1 && exit\r`)

    const completion = this._waitForCompletion()
    const waitPromise = wait(delay)
    await Promise.race([completion, waitPromise])

    this.running = false
  }

  async input(command, delay = 200) {
    this._write(command)
    return wait(delay)
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

  stripAnsi(inputString) {
    return inputString.replace(ansiEscapeCodesPattern, '')
  }

  has(output) {
    assert.ok(
      this.output.includes(output),
      this.outputErrorMessage(output, true),
    )
  }

  notHas(output) {
    assert.ok(
      !this.output.includes(output),
      this.outputErrorMessage(output, false),
    )
  }

  outputErrorMessage(expected, include) {
    let str = '\n'
    str += chalk.black(
      `\nExpected output to${include ? ' ' : ' NOT '}include:\n`,
    )
    str += '```\n'
    str += chalk.yellow(expected) + '\n'
    str += '```\n\n'
    str += 'Actual output:\n'
    str += '```\n'
    str += chalk.red(this.output)
    str += '```\n'
    return str
  }
}

module.exports = { Terminal, keys }
