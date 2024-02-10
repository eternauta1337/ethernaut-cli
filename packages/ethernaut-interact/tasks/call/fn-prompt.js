const loadAbi = require('./load-abi');
const { getFunctionSignature } = require('../../internal/signatures');
const suggest = require('common/enquirer-suggest');
const { AutoComplete } = require('enquirer');
const debug = require('common/debugger');

module.exports = async function prompt({ abiPath }) {
  if (!abiPath) return;

  try {
    const abi = loadAbi(abiPath);
    const abiFns = abi.filter((fn) => fn.name && fn.type === 'function');

    const choices = abiFns.map((fn) => getFunctionSignature(fn));

    const prompt = new AutoComplete({
      message: 'Pick a function',
      limit: 15,
      suggest,
      choices,
    });

    return await prompt.run().catch(() => process.exit(0));
  } catch (err) {
    debug.log(err);
  }
};
