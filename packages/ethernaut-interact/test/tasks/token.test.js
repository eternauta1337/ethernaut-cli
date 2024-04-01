const { Terminal } = require('ethernaut-common/src/test/terminal')

describe('contract', function () {
  const terminal = new Terminal()

  describe('when interacting with a token', function () {
    let token

    before('deploy a token', async function () {
      const factory = await hre.ethers.getContractFactory('TestToken')
      token = await factory.deploy('Test Token', 'TEST', 16)
    })

    describe('when reading the token name', function () {
      before('run contract', async function () {
        await terminal.run(
          `hardhat interact token ${await token.getAddress()} --no-confirm --fn name --params ''`,
        )
      })

      it('Printed the name', async function () {
        terminal.has('name() => Test Token')
      })
    })
  })
})
