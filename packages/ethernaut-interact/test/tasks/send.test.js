const assert = require('assert')
const { almostEqual } = require('common/src/math')
const getBalance = require('../../src/internal/get-balance')
const { Terminal } = require('common/src/terminal')

describe('send', function () {
  const terminal = new Terminal()

  describe('when sending ETH between EOAs', function () {
    let signer1, signer2
    let balance1, balance2

    before('get signers', async function () {
      const signers = await hre.ethers.getSigners()
      signer1 = signers[0]
      signer2 = signers[1]
    })

    const itPrintsPreliminaryInfo = () => {
      it('shows that the signer is connected and prints the correct initial balance', async function () {
        assert.ok(
          terminal.output.includes(
            `Connected signer ${signer1.address} (${balance1} ETH)`,
          ),
        )
      })

      it('printed a tx summary', async function () {
        assert.ok(terminal.output.includes('Pending Tx'))
        assert.ok(
          terminal.output.includes(
            'Sending 1 ETH (1000000000000000000 wei) to',
          ),
        )
        assert.ok(terminal.output.includes(`Signer: ${signer1.address}`))
        assert.ok(terminal.output.includes(`Balance: ${balance1} ETH`))
        assert.ok(terminal.output.includes(`To: ${signer2.address}`))
        assert.ok(terminal.output.includes('Value: 1 ETH'))
      })
    }

    const itPrintsPostTxInfo = () => {
      it('shows tx receipt', async function () {
        assert.ok(terminal.output.includes('Transaction Receipt'))
        assert.ok(terminal.output.includes('Tx hash:'))
        assert.ok(terminal.output.includes('Gas price:'))
        assert.ok(terminal.output.includes('Gas used: 21000'))
        assert.ok(terminal.output.includes('Block number:'))
      })

      it('shows shows final sender balance', async function () {
        const newBalance1 = await getBalance(signer1.address)
        assert.ok(
          terminal.output.includes(`i Resulting balance: ${newBalance1}`),
        )
      })
    }

    const itModifiesBalances = () => {
      it('reduced signer 1 balance', async function () {
        const newBalance1 = await getBalance(signer1.address)
        assert.strictEqual(almostEqual(newBalance1, balance1 - 1), true)
      })

      it('increased signer 2 balance', async function () {
        const newBalance2 = await getBalance(signer2.address)
        assert.equal(newBalance2 - balance2, 1, 'balance2')
      })
    }

    describe('when signer 1 sends ETH to signer 2 with no prompting', function () {
      before('get initial balances', async function () {
        balance1 = await getBalance(signer1.address)
        balance2 = await getBalance(signer2.address)
      })

      before('run send', async function () {
        await terminal.run(
          `npx hardhat interact send --address ${signer2.address} --value 1 --no-confirm`,
          1000,
        )
      })

      itPrintsPreliminaryInfo()
      itModifiesBalances()
      itPrintsPostTxInfo()
    })

    describe('when signer 1 sends ETH to signer 2 with prompting', function () {
      before('get initial balances', async function () {
        balance1 = await getBalance(signer1.address)
        balance2 = await getBalance(signer2.address)
      })

      before('run send', async function () {
        await terminal.run(
          `npx hardhat interact send --address ${signer2.address} --value 1`,
          1000,
        )
      })

      itPrintsPreliminaryInfo()

      it('prompts the user for confirmation', async function () {
        assert.ok(
          terminal.output.includes('Do you want to proceed with the call?'),
        )
      })

      describe('when the user confirms', function () {
        before('type y', async function () {
          await terminal.input('y', 200)
        })

        itModifiesBalances()
        itPrintsPostTxInfo()
      })
    })
  })
})
