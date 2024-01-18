const chalk = require('chalk');
const path = require('path');
const { copyToClipboard } = require('./copy-to-clipboard');

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

function debug(...msgs) {
  const msg = `[${_getCallerFile()}] ${msgs.join(' ')}`;
  console.log(chalk.dim(msg));
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
  debug,
  error,
  warn,
};
