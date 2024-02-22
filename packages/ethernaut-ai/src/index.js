const { extendEnvironment, extendConfig } = require('hardhat/config');
const requireAll = require('common/require-all');
const spinner = require('common/spinner');

requireAll(__dirname, 'tasks');

extendEnvironment((hre) => {
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
