const { Terminal } = require('ethernaut-common/src/test/terminal')

describe('params ERC20 prompt', function () {
  const terminal = new Terminal()

  describe('when transferring a token', function () {
    const addr = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
    before('interact', async function () {
      await terminal.run(
        `npx nyc hardhat interact token ${addr} --fn transfer`,
        4000,
      )
    })

    it('queries _to', async function () {
      terminal.has('Enter _to (address)')
    })

    describe('when _to is entered', function () {
      before('enter', async function () {
        await terminal.input(`${addr}\n`, 200)
      })

      it('queries value', async function () {
        terminal.has('Enter _value (uint256)')
      })
    })
  })
})
