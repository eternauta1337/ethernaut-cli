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
  log,
};
