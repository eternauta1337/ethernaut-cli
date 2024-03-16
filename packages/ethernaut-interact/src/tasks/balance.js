const output = require('ethernaut-common/src/ui/output')
const types = require('ethernaut-common/src/validation/types')
const { getContract } = require('../internal/get-contract')

require('../scopes/interact')
  .task('balance', 'Queries the ETH or TOKEN balance of an address')
  .addPositionalParam(
    'address',
    'The address whose balance will be queried',
    undefined,
    types.address,
  )
  .addParam('token', 'The token address or ETH', 'ETH', types.address)
  .setAction(async ({ address, token }, hre) => {
    try {
      let balance
      if (!token || token === 'ETH') {
        balance = await getETHBalance(address, hre)
      } else {
        balance = await getTokenBalance(address, token, hre)
      }

      let str = ''
      str += `Address: ${address}\n`
      str += `Token: ${token}\n`
      str += `Balance: ${balance}`

      return output.resultBox(str)
    } catch (err) {
      return output.errorBox(err)
    }
  })

async function getETHBalance(address, hre) {
  return hre.ethers.formatEther(await hre.ethers.provider.getBalance(address))
}

async function getTokenBalance(address, token, hre) {
  const contract = await getContract('erc20', token, hre)

  const rawBalance = await contract.balanceOf(address)
  const decimals = await contract.decimals()

  return hre.ethers.formatUnits(rawBalance, decimals)
}
