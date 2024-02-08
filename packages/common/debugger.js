const path = require('path');
const debugLib = require('debug');

const PREFIX = 'hardhat:ethernaut';
const _debugs = {};

function log(msg, channel = PREFIX) {
  const debug =
    _debugs[channel] || (_debugs[channel] = debugLib(`${PREFIX}:${channel}`));

  debug(`[${_getCallerFile()}]`, msg);
}

const _getCallerFile = () => {
  const originalFunc = Error.prepareStackTrace;

  let caller;
  try {
    const err = new Error();
    let current;

    Error.prepareStackTrace = function (err, stack) {
      return stack;
    };

    current = err.stack.shift();

    while (err.stack.length) {
      caller = err.stack.shift();

      if (current.getFileName() !== caller.getFileName()) break;
    }
  } catch (e) {}

  Error.prepareStackTrace = originalFunc;

  if (caller) {
    const filename = path.basename(caller.getFileName());
    const linenum = caller.getLineNumber();
    return `${filename}:${linenum}`;
  } else {
    return undefined;
  }
};

module.exports = {
  log,
};
