const loadAbi = require('./load-abi');
const { Input } = require('enquirer');

module.exports = async function prompt({ abiPath, fn }) {
  const abi = loadAbi(abiPath);
  if (!abi) return;

  const fnName = fn.split('(')[0];
  const abiFn = abi.find((abiFn) => abiFn.name === fnName);

  let params = [];
  for (const input of abiFn.inputs) {
    const prompt = new Input({
      message: `Enter ${input.name} (${input.type})`,
    });

    const response = await prompt.run().catch(() => process.exit(0));

    params.push(response);
  }

  return JSON.stringify(params);
};
