const { getEthernautFolderPath } = require('ethernaut-common/src/storage')
const fs = require('fs')
const path = require('path')

async function getContract(abiName, address, hre) {
  return hre.ethers.getContractAt(getAbi(abiName), address)
}

function getAbi(abiName) {
  const abisPath = path.join(getEthernautFolderPath(), 'interact', 'abis')
  const filePath = path.join(abisPath, `${abiName}.json`)

  let abi = JSON.parse(fs.readFileSync(filePath, 'utf8'))

  if (abi.abi) abi = abi.abi

  return abi
}

module.exports = {
  getContract,
}
