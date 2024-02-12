const loadAbi = require('./load-abi');
const debug = require('common/debugger');
const prompt = require('common/prompt');

module.exports = async function ({ abiPath, fn }) {
  if (!abiPath) return;

  try {
    const abi = loadAbi(abiPath);

    const fnName = fn.split('(')[0];
    const abiFn = abi.find((abiFn) => abiFn.name === fnName);

    // If the active function is not payable, set value to 0
    // to skip the input prompt
    const isPayable = abiFn.payable || abiFn.stateMutability === 'payable';
    if (!isPayable) return 0;
  } catch (err) {
    debug.log(err, 'interact');
  }
};
