/** @type import('hardhat/config').HardhatUserConfig */
require('@nomicfoundation/hardhat-ethers')
require('../../../src/index')

module.exports = {
  solidity: '0.8.24',
  defaultNetwork: 'local',
  networks: {
    local: {
      url: 'http://localhost:8545',
    },
    mainnet: {
      url: 'https://ethereum-rpc.publicnode.com',
    },
  },
}
