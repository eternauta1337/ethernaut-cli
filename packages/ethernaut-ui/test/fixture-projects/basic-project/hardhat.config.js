/** @type import('hardhat/config').HardhatUserConfig */
require('@nomicfoundation/hardhat-ethers')
require('../../../src/index')
require('../../../../ethernaut-util/src/index')
const { prompt } = require('ethernaut-common/src/ui/prompt')

const types = require('ethernaut-common/src/validation/types')
const { task } = require('hardhat/config')

const t = task('sample', 'Sample task')
  .addPositionalParam('param', 'Sample param', 'default-value', types.string)
  .addParam('num', 'Sample number', 42, types.int)
  .setAction(async ({ param }) => {
    console.log(`Sample task: ${param}`)
  })
t.positionalParamDefinitions.find((p) => p.name === 'param').isOptional = false
t.paramDefinitions.num.isOptional = false
t.paramDefinitions.num.suggest = async ({ num }) => {
  if (!isNaN(num)) return num + 1
}
t.paramDefinitions.num.prompt = async ({ num }) =>
  prompt({
    type: 'input',
    message: 'Enter the number',
    initial: num,
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
      exclude: ['vars/*', 'compile'],
    },
  },
}
