const loadAbi = require('./load-abi');
const {
  getFunctionSignature,
  getPopulatedFunctionSignature,
} = require('../../internal/signatures');
const debug = require('common/debug');
const prompt = require('common/prompt');

module.exports = async function ({ abiPath }) {
  if (!abiPath) return;

  try {
    const abi = loadAbi(abiPath);
    const isFunction = (fn) => fn.type === 'function';
    const abiFns = abi.filter((el) => isFunction(el));
    const choices = abiFns.map((fn) => ({
      title: getPopulatedFunctionSignature(fn),
      value: getFunctionSignature(fn),
    }));

    return await prompt({
      type: 'autocomplete',
      message: 'Pick a function',
      limit: 15,
      choices,
    });
  } catch (err) {
    debug.log(err, 'interact');
  }
};
