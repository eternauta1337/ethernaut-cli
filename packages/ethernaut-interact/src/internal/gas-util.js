const output = require('ethernaut-common/src/ui/output')
const { prompt } = require('ethernaut-common/src/ui/prompt')
const getBalance = require('../internal/get-balance')

const WARN_GAS_COST_ETH = 0.1

async function getGasData(hre, gasAmount) {
  const feeData = await hre.ethers.provider.getFeeData()
  const price = feeData.maxFeePerGas
  const cost = gasAmount * price
  const priceGwei = hre.ethers.formatUnits(price, 'gwei')
  const costEth = hre.ethers.formatEther(cost)
  return { price, cost, priceGwei, costEth }
}

async function warnHighGasCost(gasCostEth) {
  if (gasCostEth > WARN_GAS_COST_ETH) {
    output.warn(
      `The gas cost of this transaction is ${gasCostEth} ETH. This is a high gas cost.`,
    )

    const response = await prompt({
      type: 'confirm',
      message: 'Do you want to proceed with the call?',
    })

    return response
  }

  return true
}

async function warnInsufficientFunds(signer, gasCostEth, value) {
  const balance = await getBalance(signer.address)
  const totalCost = Number(gasCostEth) + Number(value)

  if (totalCost > balance) {
    output.warn(
      `The signer's balance is ${balance} ETH. This is not enough to cover the transaction cost of ${totalCost} ETH.`,
    )

    const response = await prompt({
      type: 'confirm',
      message: 'Do you want to proceed with the call?',
    })

    return response
  }

  return true
}

module.exports = {
  getGasData,
  warnHighGasCost,
  warnInsufficientFunds,
}
