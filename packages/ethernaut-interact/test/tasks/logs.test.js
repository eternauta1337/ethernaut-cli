const { Terminal } = require('ethernaut-common/src/test/terminal')

describe('logs', function () {
  const terminal = new Terminal()

  describe('with a token', function () {
    let token

    before('deploy a token', async function () {
      const factory = await hre.ethers.getContractFactory('TestToken')
      token = await factory.deploy('Test Token', 'TEST', 16)
    })

    describe('with transfers', function () {
      let signer1, signer2, signer3

      before('get signers', async function () {
        const signers = await hre.ethers.getSigners()
        signer1 = signers[0]
        signer2 = signers[1]
        signer3 = signers[2]
      })

      before('transfer', async function () {
        let tx
        tx = await token.transfer(signer2.address, 42)
        await tx.wait()

        tx = await token.transfer(signer3.address, 1337)
        await tx.wait()
      })

      describe('when finding logs', function () {
        before('use cli', async function () {
          await terminal.run(
            `hardhat interact logs --address ${await token.getAddress()} --abi artifacts/contracts/TestToken.sol/TestToken.json --event Transfer --params ''`,
          )
        })

        it('prints 3 logs', async function () {
          terminal.has('Found 3 logs')
        })

        it('has a log for signer 1', async function () {
          terminal.has(`address to = ${signer1.address}`)
        })

        it('has a log for signer 2', async function () {
          terminal.has(`address to = ${signer2.address}`)
        })

        it('has a log for signer 3', async function () {
          terminal.has(`address to = ${signer3.address}`)
        })
      })
    })
  })
})
