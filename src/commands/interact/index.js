const chalk = require('chalk');
const { Command } = require('commander');
const logger = require('@src/internal/logger');
const { getProvider } = require('@src/internal/get-provider');
const findContract = require('@src/internal/find-contract');
const getSelectors = require('@src/internal/selectors');
const {
  getFunctionSignature,
  getFullFunctionSignature,
  getFullEventSignature,
} = require('@src/internal/signatures');
const { prompt } = require('@src/internal/interactive/prompt');
const ethers = require('ethers');
const spinner = require('@src/internal/spinner');

const command = new Command();

command
  .name('interact')
  .description('Interacts with a contract')
  .argument('[nameOrAddress]', 'The name or address of the contract')
  .action(async (nameOrAddress) => {
    if (nameOrAddress === undefined) {
      logger.error(
        'You must provide either the name or address of the contract you want to interact with'
      );
      return;
    }

    // Get network name
    const provider = await getProvider();
    const network = await provider.getNetwork();
    logger.debug('Network:', network.name);

    // Get contract abi
    let contractInfo;
    try {
      contractInfo = await findContract(nameOrAddress, network);
    } catch (error) {
      logger.error(
        `Unable to find contract abi with the information provided: ${nameOrAddress} - ${error.message}`
      );
      return;
    }

    await interact(contractInfo, provider);
  });

async function interact(contractInfo, provider) {
  logger.info(`Interacting with contract "${contractInfo.name}"`);

  // Pick a function to call
  const abiFn = await pickFunction(contractInfo.abi);
  const functionSignature = getFunctionSignature(abiFn);

  // Collect parameters for call
  const params = await pickParameters(abiFn);
  const fullFunctionSignature = getFullFunctionSignature(abiFn, params);
  logger.info(fullFunctionSignature);

  // Set up contract
  const contract = new ethers.Contract(
    contractInfo.address,
    contractInfo.abi,
    provider
  );

  // Display calldata
  const tx = await contract.populateTransaction[functionSignature](...params);
  logger.info(`Calldata: ${tx.data}`);

  // Execute the call (can be read or write)
  const readOnly =
    abiFn.stateMutability === 'view' || abiFn.stateMutability === 'pure';
  if (readOnly) {
    await executeReadTransaction(functionSignature, contract);
  } else {
    await executeWriteTransaction(
      functionSignature,
      contract,
      params,
      contractInfo.abi
    );
  }

  // Interact again?
  const shouldContinue = await prompt({
    type: 'confirm',
    message: 'Continue interacting?',
  });
  if (shouldContinue) {
    await interact(contractInfo, provider);
  }
}

async function executeReadTransaction(functionSignature, contract) {
  await spinner.show('Executing read transaction...');

  const response = await contract[functionSignature]();
  await spinner.hide();

  logger.info('Response:', response);
}

async function executeWriteTransaction(
  functionSignature,
  contract,
  params,
  abi
) {
  // TODO: Get signer from config
  // This is from anvil print out
  // const signer = await contract.provider.getSigner(0);
  const pks = [
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', // 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  ];
  const signer = new ethers.Wallet(pks[0], contract.provider);
  logger.info(`Signer: ${signer.address}`);

  contract = contract.connect(signer);

  let tx;
  try {
    const estimateGas = await contract.estimateGas[functionSignature](
      ...params
    );

    const confirmed = await prompt({
      type: 'confirm',
      message: `Estimated gas: ${estimateGas}. Continue?`,
    });

    if (!confirmed) {
      return;
    }

    tx = await contract[functionSignature](...params);
  } catch (error) {
    logger.error(
      `Transaction reverted during gas estimation with error "${error}"`
    );
  }

  if (tx) {
    logger.info(`Sending transaction with hash ${tx.hash}`);
    // logger.debug(JSON.stringify(tx, null, 2));

    await spinner.show('Executing WRITE transaction...');

    let receipt;
    try {
      receipt = await tx.wait();
    } catch (error) {
      logger.error(
        `Error sending transaction: ${error}\n${JSON.stringify(tx, null, 2)}`
      );
    }
    spinner.stop('Transaction mined');

    if (receipt) {
      logger.info(`Transaction mined with gas ${receipt.gasUsed}`);

      if (receipt.status === 0) {
        logger.error(
          `Transaction reverted:\n${JSON.stringify(receipt, null, 2)}`
        );
      } else {
        logger.info('Transaction succeeded');
      }

      // logger.debug(JSON.stringify(receipt, null, 2));

      _printEventsInReceipt(receipt, abi);
    }
  }
}

function _printEventsInReceipt(receipt, abi) {
  const numEvents = receipt.events.length;

  if (numEvents > 0) {
    logger.info(`(${numEvents}) events emitted:`);

    receipt.events.forEach((event) => {
      if (event.event) {
        const eventAbi = abi.find((abiItem) => abiItem.name === event.event);

        console.log(chalk.green(`✓ ${getFullEventSignature(eventAbi, event)}`));
      } else {
        logger.log(
          chalk.gray(
            `* Unknown event with topics: [${event.topics}] and data: [${event.data}]`
          )
        );
      }

      // logger.debug(JSON.stringify(event, null, 2));
    });
  }
}

async function pickParameters(abiFn) {
  const params = [];

  for (let i = 0; i < abiFn.inputs.length; i++) {
    const parameter = abiFn.inputs[i];

    const response = await prompt({
      type: 'text',
      name: 'answer',
      message: `${parameter.name} (${parameter.type}):`,
    });

    try {
      params.push(await _parseInput(response, parameter.type));
    } catch (error) {
      logger.warn(error);
    }
  }

  return params;
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
  const abiCoder = ethers.utils.defaultAbiCoder;
  input = abiCoder.encode([type], [input]);
  input = abiCoder.decode([type], input)[0];

  return input;
}

async function _preprocessInput(input, type) {
  const isNumber = !isNaN(input);
  const isHex = ethers.utils.isHexString(input);

  // E.g. "sUSD" to "0x7355534400000000000000000000000000000000000000000000000000000000"
  if (type === 'bytes32' && !isNumber && !isHex) {
    return ethers.utils.formatBytes32String(input);
  }

  // E.g. "self" or "signer" to signer address
  if ((type === 'address' && input === 'self') || input === 'signer') {
    return (await ethers.getSigners())[0].address;
  }

  return input;
}

async function pickFunction(abi) {
  const abiFns = abi.filter(
    (abiItem) => abiItem.name && abiItem.type === 'function'
  );

  const selectors = await getSelectors(abi);

  const choices = abiFns.map((abiFn) => {
    const functionSignature = getFunctionSignature(abiFn);
    const fullFunctionSignature = getFullFunctionSignature(abiFn);

    const selector = selectors.find(
      (selector) => selector.name === abiFn.name
    ).selector;

    return {
      title: `${fullFunctionSignature}${chalk.gray(` ${selector}`)}`,
      value: functionSignature,
    };
  });

  const response = await prompt({
    type: 'autocomplete',
    message: 'Pick a function',
    choices,
  });

  const abiFn = abiFns.find((abiFn) => {
    const functionSignature = getFunctionSignature(abiFn);
    return functionSignature === response;
  });

  return abiFn;
}

module.exports = command;
