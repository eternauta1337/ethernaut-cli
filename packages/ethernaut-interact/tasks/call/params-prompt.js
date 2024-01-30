const loadAbi = require('./load-abi');
const { Input } = require('enquirer');

module.exports = async function prompt({ abiPath, fn }) {
  const abi = loadAbi(abiPath);

  const abiFn = abi.find((abiFn) => abiFn.name === fn.split('(')[0]);

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
