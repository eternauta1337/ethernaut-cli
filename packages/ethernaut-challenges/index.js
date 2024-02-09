const { extendEnvironment, extendConfig } = require('hardhat/config');
const requireAll = require('common/require-all');

requireAll(__dirname, 'tasks');

extendEnvironment((hre) => {});

extendConfig((config, userConfig) => {
  if (config.ethernaut.ai) {
    config.ethernaut.ai.interpreter.additionalInstructions.push(
      "If asked to complete ethernaut challenges use the info command to get information about the level, including how to play it, where to find the abi, the instance's Solidity source code, etc. Make sure to look at the source carefully. Use the instance command to produce an instance of the level. Do not recommend using the web dapp of the game. Always play it using the interact package of this cli application. Try to solve the level yourself using the cli tools. Do not attempt to run a script with the run command, or compile any contracts. You may provide code for a javascript script that the user may run manually. If so, use the ethers library instead of web3. You will be able to sign transactions with the call command and always have ether to play. Once a level instance has been manipulated to the satisfaction of the level instructions, make sure to submit the instance with the instance command"
    );
  }
});
