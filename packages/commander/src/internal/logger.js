const chalk = require('chalk');
const path = require('path');
const zmq = require('zeromq');
const { copyToClipboard } = require('./copy-to-clipboard');

let socket;

async function initSocket() {
  socket = new zmq.Push();
  await socket.bind('tcp://127.0.0.1:3000');
}

function output(msg) {
  const regex = /<(.+?)>/;
  const match = msg.match(regex);

  if (match) {
    const specialMsg = match[1];
    copyToClipboard(specialMsg);
    msg = msg.replace(regex, chalk.green.bold(specialMsg));
  }

  console.log('»', msg);
}

async function debug(...msgs) {
  if (!socket) await initSocket();

  const msg = `[${_getCallerFile()}] ${msgs
    .map((m) => {
      if (typeof m === 'object') {
        return JSON.stringify(m, null, 2);
      } else {
        return m.toString();
      }
    })
    .join(' ')}`;

  await socket.send(msg);
}

function info(...msgs) {
  const msg = `${msgs.join(' ')}`;
  console.warn(chalk.blue(msg));
}

function error(error) {
  console.error(chalk.red(error));
}

function warn(...msgs) {
  const msg = `! ${msgs.join(' ')}`;
  console.warn(chalk.yellow(msg));
}

const _getCallerFile = () => {
  const originalFunc = Error.prepareStackTrace;

  let callerfile;
  try {
    const err = new Error();
    let currentfile;

    Error.prepareStackTrace = function (err, stack) {
      return stack;
    };

    currentfile = err.stack.shift().getFileName();

    while (err.stack.length) {
      callerfile = err.stack.shift().getFileName();

      if (currentfile !== callerfile) break;
    }
  } catch (e) {}

  Error.prepareStackTrace = originalFunc;

  return callerfile ? path.basename(callerfile) : undefined;
};

module.exports = {
  output,
  info,
  debug,
  error,
  warn,
};
