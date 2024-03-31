const path = require('path')
const storage = require('ethernaut-interact/src/internal/storage')
const { Terminal, keys } = require('ethernaut-common/src/test/terminal')

describe('event prompt', function () {
  const addr = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
  const abi = path.resolve(storage.getAbisFilePath(), 'erc20.json')

  const terminal = new Terminal()

  describe('when an abi is provided', function () {
    before('call', async function () {
      await terminal.run(
        `npx nyc hardhat interact logs --address ${addr} --abi ${abi}`,
        2000,
      )
    })

    it('presents events', async function () {
      terminal.has('Approval')
      terminal.has('Transfer')
    })

    describe('when selecting Transfer', function () {
      before('interact', async function () {
        await terminal.input(keys.DOWN)
        await terminal.input(keys.ENTER)
      })

      it('prompts for from address', async function () {
        terminal.has('Enter from (address)')
      })

      describe('when specifying from address', function () {
        before('interact', async function () {
          await terminal.input(`${addr}\r`)
        })

        it('prompts for to address', async function () {
          terminal.has('Enter to (address)')
        })
      })
    })
  })
})
