const { extendEnvironment, extendConfig } = require('hardhat/config');
const requireAll = require('common/require-all');
const spinner = require('common/spinner');
const output = require('common/output');

requireAll(__dirname, 'tasks');

extendEnvironment(async (hre) => {
  await output.init();
  spinner.enable(!hre.hardhatArguments.verbose);
});

extendConfig((config, userConfig) => {
  config = {
    ...config,
    ethernaut: {
      ai: {
        interpreter: {
          additionalInstructions:
            userConfig.ethernaut.ai.interpreter.additionalInstructions || [],
        },
      },
    },
  };
});
