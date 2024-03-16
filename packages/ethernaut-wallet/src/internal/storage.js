const fs = require('fs')
const path = require('path')
const {
  createFolderIfMissing,
  createFileIfMissing,
} = require('ethernaut-common/src/io/create-file')
const { getEthernautFolderPath } = require('ethernaut-common/src/io/storage')

/**
 * Stores data like this:
 * ~/
 *   .ethernaut/
 *     signer/
 *       signers.json
 *
 * signers.json schema:
 * {
 *    activeSigner: 'signerAlias1',
 *    signerAlias1: {
 *      pl: '0x123...'
 *    },
 *    signerAlias2: { .. },
 *    ...
 * }
 */

function readSigners() {
  return JSON.parse(fs.readFileSync(getSignersFilePath()))
}

function storeSigners(signers) {
  fs.writeFileSync(getSignersFilePath(), JSON.stringify(signers, null, 2))
}

function init() {
  createFolderIfMissing(getSignerFolderPath())
  createFileIfMissing(getSignersFilePath(), {
    activeSigner: 'none',
  })
}

function getSignerFolderPath() {
  return path.join(getEthernautFolderPath(), 'signer')
}

function getSignersFilePath() {
  return path.join(getSignerFolderPath(), 'signers.json')
}

module.exports = {
  init,
  readSigners,
  storeSigners,
  getSignerFolderPath,
}
