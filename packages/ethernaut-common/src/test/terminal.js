const debug = require('ethernaut-common/src/ui/debug')
const assert = require('assert')
const chalk = require('chalk')
const wait = require('ethernaut-common/src/util/wait')
const { spawn } = require('child_process')
const kill = require('tree-kill')
const path = require('path')

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
    this.command = ''
  }

  async run(command, delay = 10000, killAfter = false) {
    this.output = ''

    // Build the command to call as:
    // node nyc node hardhat ...args
    // Which is extremely weird, but its the only way I found to guarantee
    // proper test coverage with nested processes
    const n = path.resolve(
      __dirname,
      '../../../../',
      'node_modules/nyc/bin/nyc.js',
    )
    const h = path.resolve(
      __dirname,
      '../../../../',
      'node_modules/.bin/hardhat',
    )
    command = command.replace('hardhat', h)
    const args = command.split(' ')
    args.unshift(n, process.execPath)
    args.concat(['&&', 'sleep', '1', '&&', 'exit'])
    const f = process.execPath
    this.command = `${f} ${args.join(' ')}`
    debug.log(`Running command: ${this.command}}`, 'terminal')

    // Spawn the process and immediately attach event handlers
    this.process = spawn(f, args, { shell: true, stdio: 'pipe' })

    const onData = (data) => {
      const txt = data.toString().replace(ansiEscapeCodesPattern, '')
      this.history += txt
      this.output += txt
      debug.log(`Terminal output: ${txt}`, 'terminal')
    }

    const onError = (data) => {
      throw new Error(`Terminal error, ${data}`)
    }

    this.process.stdout.on('data', onData)
    this.process.stderr.on('data', onData)
    this.process.stderr.on('error', onError)

    const completion = this._waitForCompletion().then(() => ({
      type: 'completion',
    }))
    const waitPromise = wait(delay).then(() => ({ type: 'wait' }))
    const result = await Promise.race([completion, waitPromise])
    debug.log(`Terminal process ended with type: ${result.type}`, 'terminal')
    if (result.type === 'wait') {
      if (killAfter) this.kill()
    }
  }

  kill() {
    this.process.stdout.removeAllListeners('data')
    this.process.stderr.removeAllListeners('data')
    this.process.stderr.removeAllListeners('error')
    kill(this.process.pid, 'SIGKILL', (err) => {
      if (err) debug.log(`Unable to kill process: ${err}`, 'terminal')
      else debug.log('Killed process', 'terminal')
    })
  }

  async input(command, delay = 200) {
    this._write(command)
    return wait(delay)
  }

  _waitForCompletion() {
    return new Promise((resolve) => {
      this.process.once('close', (code) => {
        debug.log(`Command completed with code ${code}`, 'terminal')
        resolve()
      })
    })
  }

  _write(content) {
    this.output = ''
    this.process.stdin.write(content)
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

    str += chalk.black(`Command: ${this.command}\n`)
    str += '```\n'
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
