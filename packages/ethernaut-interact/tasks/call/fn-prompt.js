const loadAbi = require('./load-abi');
const { getFunctionSignature } = require('../../internal/signatures');
const suggest = require('utilities/enquirer-suggest');
const { AutoComplete } = require('enquirer');

module.exports = async function prompt({ abiPath }) {
  const abi = loadAbi(abiPath);

  const abiFns = abi.filter((fn) => fn.name && fn.type === 'function');

  const choices = abiFns.map((fn) => getFunctionSignature(fn));

  const prompt = new AutoComplete({
    type: 'autocomplete',
    message: 'Pick a function',
    limit: 15,
    suggest,
    choices,
  });

  const response = await prompt.run().catch(() => process.exit(0));
  console.log(response);

  return response;
};
