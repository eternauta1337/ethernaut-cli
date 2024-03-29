const storage = require('ethernaut-common/src/io/storage')
const path = require('path')
require('dotenv').config({
  path: path.resolve(storage.getEthernautFolderPath(), '.env'),
})
require('@nomicfoundation/hardhat-ethers')
require('../../../src/index')

module.exports = {
  solidity: '0.8.24',
  defaultNetwork: 'local',
  networks: {
    local: {
      url: 'http://localhost:8545',
    },
  },
}
