const storage = require('ethernaut-interact/src/internal/storage')
const EtherscanApi = require('ethernaut-interact/src/internal/etherscan')
const prompt = require('common/src/prompt')
const spinner = require('common/src/spinner')
const debug = require('common/src/debug')
const { getNetworkName } = require('common/src/network')
const checkEnvVar = require('common/src/check-env')

const strategies = {
  ETHERSCAN: 'Fetch from Etherscan',
  BROWSE: 'Browse known ABIs',
  MANUAL: 'Enter path manually',
}

module.exports = async function promptAbi({ abi, hre, address }) {
  try {
    const network = await getNetworkName(hre)

    // Let the user select a strategy
    const choice = await selectStrategy({ address, network })
    debug.log(`Chosen strategy: ${choice}`, 'interact')

    // Execute the chosen strategy
    switch (choice) {
      case strategies.BROWSE:
        abi = await browseKnwonAbis()
        break
      case strategies.ETHERSCAN:
        abi = await getAbiFromEtherscan(address, network)
        break
      case strategies.MANUAL:
      // Do nothing
    }

    // Remember anything?
    // Note: The abi file is stored below when fetching from Etherscan
    if (abi && address) {
      storage.rememberAbiAndAddress(abi, address, network)
    }

    return abi
  } catch (err) {
    debug.log(err, 'interact')
  }
}

async function selectStrategy({ address }) {
  // Collect available choices since
  // not all strategies might be available
  const choices = [strategies.MANUAL]

  // Pick one one from known abis?
  const knownAbiFiles = storage.readAbiFiles()
  debug.log(`Known ABI files: ${knownAbiFiles.length}`, 'interact')
  if (knownAbiFiles.length > 0) {
    choices.push(strategies.BROWSE)
  } else {
    debug.log('Cannot browse abis', 'interact')
  }

  // Fetch from Etherscan?
  if (address) {
    choices.push(strategies.ETHERSCAN)
  } else {
    debug.log('Cannot fetch from Etherscan', 'interact')
  }

  // No choices?
  if (choices.length === 0) {
    debug.log('No ABI strategies available', 'interact')
    return
  }

  // A single choice?
  if (choices.length === 1) {
    debug.log(
      `Single strategy available (skipping prompt): ${choices[0]}`,
      'interact',
    )
    return choices[0]
  }

  // Show prompt
  debug.log(`Prompting for stragtegy - choices: ${choices}`, 'interact')

  return await prompt({
    type: 'select',
    message: 'How would you like to specify an ABI?',
    choices,
  })
}

async function browseKnwonAbis() {
  const abiFiles = storage.readAbiFiles()

  const choices = abiFiles.map((file) => ({
    message: file.name,
    value: file.path,
  }))

  return await prompt({
    type: 'autocomplete',
    message: 'Pick an ABI',
    limit: 15,
    choices,
  })
}

async function getAbiFromEtherscan(address, network) {
  await checkEnvVar(
    'ETHERSCAN_API_KEY',
    'This key is required to fetch ABIs from Etherscan',
  )

  spinner.progress('Fetching ABI from Etherscan...', 'etherscan')

  const networkComp = network === 'mainnet' ? '' : `-${network}`

  const etherscan = new EtherscanApi(
    process.env.ETHERSCAN_API_KEY,
    `https://api${networkComp}.etherscan.io`,
  )

  try {
    const info = await etherscan.getContractCode(address)
    const abi = storage.storeAbi(info.ContractName, info.ABI)

    spinner.success(
      `Abi fetched from Etherscan ${info.ContractName}`,
      'etherscan',
    )

    return abi
  } catch (err) {
    spinner.fail(
      `Unable to fetch ABI from Etherscan: ${err.message}`,
      'etherscan',
    )

    debug.log(err.message, 'etherscan')
  }
}
