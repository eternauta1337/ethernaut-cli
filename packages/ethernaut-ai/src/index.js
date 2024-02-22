const { extendEnvironment, extendConfig } = require('hardhat/config');
const requireAll = require('common/src/require-all');
const spinner = require('common/src/spinner');

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
