const { Command } = require('commander');
const hre = require('hardhat');
const chalk = require('chalk');
const prompts = require('prompts');
const logger = require('../../utils/logger');

const command = new Command();

command
  .name('interact')
  .description('Interact with a contract')
  .argument('<name>', 'Name of the contract')
  .argument('<address>', 'Address of the deployed contract')
  .action(async (name, address) => {
    let functionAbi;
    let functionParameters;

    const abi = (await hre.artifacts.readArtifact(name)).abi;

    async function pickFunction() {
      const abiFunctions = abi.filter(
        (abiItem) => abiItem.name && abiItem.type === 'function'
      );
      const selectors = await getSelectors(abi);
      const choices = abiFunctions.map((functionAbi) => {
        const fullSignature = getFullFunctionSignature(functionAbi);
        const selector = selectors.find(
          (selector) => selector.name === functionAbi.name
        ).selector;
        return {
          title: `${fullSignature}${chalk.gray(` ${selector}`)}`,
          value: functionAbi,
        };
      });

      const { selected } = await prompts([
        {
          type: 'autocomplete',
          name: 'selected',
          message: 'Pick a function',
          choices,
        },
      ]);

      functionAbi = selected;

      await pickParameters();
    }

    async function pickParameters() {
      functionParameters = [];
      let parameterIndex = 0;
      // Using a while loop so that the user can retry failed inputs
      while (parameterIndex < functionAbi.inputs.length) {
        const parameter = functionAbi.inputs[parameterIndex];

        const { answer } = await prompts([
          {
            type: 'text',
            name: 'answer',
            message: `${parameter.name} (${parameter.type}):`,
          },
        ]);

        if (answer) {
          try {
            functionParameters.push(await _parseInput(answer, parameter.type));

            parameterIndex++;
          } catch (error) {
            logger.error(error);
          }
        } else {
          await pickFunction();
        }
      }

      await callFunction();
    }

    async function executeReadTransaction(functionAbi, contract) {
      const functionName = functionAbi.name;

      let result;
      if (functionParameters.length === 0) {
        result = await contract[functionName]();
      } else {
        result = await contract[functionName](...functionParameters);
      }
      // result = await contract.info();

      console.log(chalk.green(`✓ ${result}`));
    }

    async function executeWriteTransaction(functionAbi, contract) {
      const signer = (await hre.ethers.getSigners())[1];
      logger.info(`Signer: ${signer.address}`);
      logger.warn('This is a write transaction!');

      contract = contract.connect(signer);

      let tx;
      try {
        const estimateGas = await contract[functionAbi.name].estimateGas(
          ...functionParameters
        );
        const { confirmed } = await prompts([
          {
            type: 'confirm',
            name: 'confirmed',
            message: `Estimated gas: ${estimateGas}. Continue?`,
            initial: true,
          },
        ]);
        if (!confirmed) {
          return;
        }

        tx = await contract[functionAbi.name](...functionParameters);
      } catch (error) {
        logger.error(
          `Transaction reverted during gas estimation with error "${error}"`
        );
      }

      if (tx) {
        logger.info(`Sending transaction with hash ${tx.hash}`);
        // logger.info(JSON.stringify(tx, null, 2));

        let receipt;
        try {
          receipt = await tx.wait();
        } catch (error) {
          logger.error(
            `Error sending transaction: ${error}\n${JSON.stringify(
              tx,
              null,
              2
            )}`
          );
        }

        if (receipt) {
          logger.info(`Transaction mined with gas ${receipt.gasUsed}`);

          if (receipt.status === 0) {
            logger.error(
              `Transaction reverted:\n${JSON.stringify(receipt, null, 2)}`
            );
          } else {
            logger.output('Transaction succeeded');
          }

          logger.info(JSON.stringify(receipt, null, 2));

          // TODO: Print events
        }
      }
    }

    async function callFunction() {
      logger.info(
        `Calling ${name}.${getFullFunctionSignature(
          functionAbi,
          functionParameters
        )}`
      );
      logger.info(`Target: ${address}`);

      const contract = await hre.ethers.getContractAt(name, address);
      const tx = await contract[functionAbi.name].populateTransaction(
        ...functionParameters
      );
      logger.info(`Calldata: ${tx.data}`);

      const readOnly =
        functionAbi.stateMutability === 'view' ||
        functionAbi.stateMutability === 'pure';
      if (readOnly) {
        await executeReadTransaction(functionAbi, contract);
      } else {
        await executeWriteTransaction(functionAbi, contract);
      }

      functionParameters = null;
      functionAbi = null;

      await pickFunction();
    }

    await pickFunction();
  });

async function _preprocessInput(input, type) {
  const isNumber = !isNaN(input);
  const isHex = hre.ethers.isHexString(input);

  // E.g. "sUSD" to "0x7355534400000000000000000000000000000000000000000000000000000000"
  if (type === 'bytes32' && !isNumber && !isHex) {
    return hre.ethers.formatBytes32String(input);
  }

  // E.g. "self" or "signer" to signer address
  if ((type === 'address' && input === 'self') || input === 'signer') {
    return (await hre.ethers.getSigners())[0].address;
  }

  return input;
}

async function _parseInput(input, type) {
  if (type.includes('[]')) {
    input = JSON.parse(input);
  }

  const processed = await _preprocessInput(input, type);
  if (input !== processed) {
    logger.info(`"${input}" auto-converted to "${processed}"`);

    input = processed;
  }

  // Encode and decode the user's input to parse it
  // into types acceptable by ethers.
  const abiCoder = hre.ethers.AbiCoder.defaultAbiCoder();
  input = abiCoder.encode([type], [input]);
  input = abiCoder.decode([type], input)[0];

  return input;
}

async function getSelectors(contractAbi, functionFilter = () => true) {
  const contract = await new hre.ethers.Contract(
    '0x0000000000000000000000000000000000000001',
    contractAbi
  );

  return contract.interface.fragments.reduce((selectors, fragment) => {
    if (fragment.type === 'function' && functionFilter(fragment.name)) {
      selectors.push({
        name: fragment.name,
        selector: fragment.selector,
      });
    }

    return selectors;
  }, []);
}

function getFunctionSignature(functionAbi) {
  return `${functionAbi.name}(${functionAbi.inputs
    .map((input) => input.type)
    .join(',')})`;
}

function getFullFunctionSignature(functionAbi, functionParameters) {
  const multiline = !!functionParameters && functionParameters.length > 0;

  const isWriteCall =
    functionAbi.stateMutability !== 'view' &&
    functionAbi.stateMutability !== 'pure';

  // Collect parameter list
  const parameterDescriptions = [];
  for (let i = 0; i < functionAbi.inputs.length; i++) {
    const input = functionAbi.inputs[i];

    const valueDescription = functionParameters
      ? ` = ${functionParameters[i]}`
      : '';

    parameterDescriptions.push(
      `${input.type} ${input.name}${valueDescription}`
    );
  }

  // Collect return values
  const outputDescriptions = functionAbi.outputs.map(
    (output) => `${output.type}${output.name ? ` ${output.name}` : ''}`
  );

  // Function name
  let str = `${functionAbi.name}${multiline ? '(\n' : '('}`;
  str += `${multiline ? '  ' : ''}${parameterDescriptions.join(
    multiline ? ',\n  ' : ', '
  )}`;
  str += `${multiline ? '\n)' : ')'}`;

  // Function decorators
  if (!isWriteCall) {
    str += ` ${functionAbi.stateMutability}`;
  }

  // Return values
  if (outputDescriptions.length > 0) {
    str += ` returns (${outputDescriptions.join(', ')})`;
  }

  return isWriteCall ? chalk.yellowBright.bold(str) : str;
}

module.exports = command;
