const output = require('ethernaut-common/src/ui/output')
const types = require('ethernaut-common/src/validation/types')
const { getContract } = require('../internal/get-contract')

require('../scopes/interact')
  .task('standards', 'Checks if a contract address meets known token standards')
  .addPositionalParam(
    'address',
    'The contract address to check',
    undefined,
    types.address,
  )
  .setAction(async ({ address }, hre) => {
    try {
      const isERC165Supported = await checkERC165Support(address, hre)
      const erc20 = await checkERC20(address, hre)
      const erc721Support = isERC165Supported
        ? await checkERC721(address, hre)
        : { erc721: false, metadata: false }
      const erc1155Support = isERC165Supported
        ? await checkERC1155(address, hre)
        : { erc1155: false, metadata: false }

      let str = ''
      str += `Address: ${address}\n`
      str += 'Token Standards:\n'
      str += `  ERC-165 Supported: ${isERC165Supported ? 'Yes' : 'No'}\n`
      str += `  ERC-20: ${erc20 ? 'Yes' : 'No'}\n`

      // Always show ERC-721 status
      str += `  ERC-721: ${erc721Support.erc721 ? 'Yes' : 'No'}\n`
      str += `    ERC-721 Metadata: ${erc721Support.metadata ? 'Yes' : 'No'}\n`

      // Always show ERC-1155 status
      str += `  ERC-1155: ${erc1155Support.erc1155 ? 'Yes' : 'No'}\n`
      str += `    ERC-1155 Metadata: ${erc1155Support.metadata ? 'Yes' : 'No'}\n`

      return output.resultBox(str)
    } catch (err) {
      return output.errorBox(err)
    }
  })

async function checkERC165Support(address, hre) {
  try {
    const contract = await getContract('erc165', address, hre)
    return await contract.supportsInterface('0x01ffc9a7') // ERC-165 interface ID
  } catch (err) {
    return false
  }
}

async function checkERC20(address, hre) {
  try {
    const contract = await getContract('erc20', address, hre)

    // Check the existence of key ERC-20 functions
    await contract.totalSupply()
    await contract.balanceOf(address)

    // Additional checks for ERC-20 functions using their function signatures
    const functionsToCheck = [
      'transfer',
      'approve',
      'allowance',
      'transferFrom',
    ]

    // Check if these key ERC-20 functions exist in the contract
    for (const fn of functionsToCheck) {
      if (!contract.interface.getFunction(fn)) {
        return false // If any function is missing, it's not ERC-20 compliant
      }
    }

    return true
  } catch (err) {
    return false
  }
}

async function checkERC721(address, hre) {
  try {
    const contract = await getContract('erc721', address, hre)

    // Check if the contract supports the ERC-721 interface ID using ERC-165
    const supportsInterface = await contract.supportsInterface('0x80ac58cd') // ERC-721 interface ID
    if (!supportsInterface) return false

    // Optionally, check if the contract supports ERC-721 Metadata extension
    const supportsMetadata = await contract.supportsInterface('0x5b5e139f') // ERC-721 Metadata interface ID

    // Return both ERC-721 and metadata support statuses
    return { erc721: supportsInterface, metadata: supportsMetadata }
  } catch (err) {
    return false
  }
}

async function checkERC1155(address, hre) {
  try {
    const contract = await getContract('erc1155', address, hre)

    // Check if the contract supports the ERC-1155 interface ID using ERC-165
    const supportsInterface = await contract.supportsInterface('0xd9b67a26') // ERC-1155 interface ID
    if (!supportsInterface) return false

    // Optionally, check if the contract supports ERC-1155 Metadata URI extension
    const supportsMetadata = await contract.supportsInterface('0x0e89341c') // ERC-1155 Metadata URI interface ID

    // Return both ERC-1155 and metadata support statuses
    return { erc1155: supportsInterface, metadata: supportsMetadata }
  } catch (err) {
    return false
  }
}
