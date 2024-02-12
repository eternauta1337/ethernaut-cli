const loadAbi = require('./load-abi');
const debug = require('common/debug');
const prompt = require('common/prompt');

module.exports = async function ({ abiPath, fn }) {
  if (!abiPath) return;

  try {
    const abi = loadAbi(abiPath);

    const fnName = fn.split('(')[0];
    const abiFn = abi.find((abiFn) => abiFn.name === fnName);

    let params = [];
    for (const input of abiFn.inputs) {
      const response = await prompt({
        type: 'input',
        message: `Enter ${input.name} (${input.type})`,
      });

      params.push(response);
    }

    return params.join(',');
  } catch (err) {
    debug.log(err, 'interact');
  }
};
