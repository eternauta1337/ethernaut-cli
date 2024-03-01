/** @type import('hardhat/config').HardhatUserConfig */
require('@nomicfoundation/hardhat-ethers')
require('../../../src/index')
require('../../../../ethernaut-util/src/index')

const { task } = require('hardhat/config')

task('sample', 'Sample task')
  .addPositionalParam('param', 'Sample param', 'default-value')
  .setAction(async ({ param }) => {
    console.log(`Sample task: ${param}`)
  })

module.exports = {
  solidity: '0.8.24',
  defaultNetwork: 'local',
  networks: {
    local: {
      url: 'http://localhost:8545',
    },
  },
  ethernaut: {
    ui: {
      exclude: {
        scopes: ['vars', 'hardhat'],
        tasks: ['compile'],
      },
    },
  },
}
