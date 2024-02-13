const loadAbi = require('./load-abi');
const debug = require('common/debug');

module.exports = async function ({ abi, fn }) {
  if (!abi) return;

  try {
    const _abi = loadAbi(abi);

    const fnName = fn.split('(')[0];
    const abiFn = _abi.find((abiFn) => abiFn.name === fnName);

    // If the active function is not payable, set value to 0
    // to skip the input prompt
    const isPayable = abiFn.payable || abiFn.stateMutability === 'payable';
    if (!isPayable) return 0;
  } catch (err) {
    debug.log(err, 'interact');
  }
};
