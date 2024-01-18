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

function info(...msgs) {
  console.log(chalk.gray(`i> [${_getCallerFile()}] ${msgs.join(' ')}`));
}

function error(error) {
  console.error(chalk.red(error));
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
  error,
};
