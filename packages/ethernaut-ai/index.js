const { extendEnvironment, extendConfig } = require('hardhat/config');
const requireAll = require('common/require-all');

requireAll(__dirname, 'tasks');

extendEnvironment((hre) => {});

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
