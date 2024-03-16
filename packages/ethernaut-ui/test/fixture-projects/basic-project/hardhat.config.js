/** @type import('hardhat/config').HardhatUserConfig */
require('@nomicfoundation/hardhat-ethers')
require('../../../src/index')
require('../../../../ethernaut-util/src/index')

const types = require('ethernaut-common/src/validation/types')
const { task } = require('hardhat/config')

const t = task('sample', 'Sample task')
  .addPositionalParam('param', 'Sample param', 'default-value', types.string)
  .setAction(async ({ param }) => {
    console.log(`Sample task: ${param}`)
  })
t.positionalParamDefinitions.find((p) => p.name === 'param').isOptional = false

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
      exclude: ['vars/*', 'compile'],
    },
  },
}
