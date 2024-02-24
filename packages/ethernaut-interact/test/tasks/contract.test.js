const assert = require('assert')
const getBalance = require('../../src/internal/get-balance')
const { Terminal } = require('common/src/terminal')
const path = require('path')

describe('contract', function () {
  const terminal = new Terminal()

  describe('when interacting with a sample contract', function () {
    let sample

    before('deploy sample contract', async function () {
      const Sample = await hre.ethers.getContractFactory('Sample')
      sample = await Sample.deploy()
    })

    describe('via ethers', function () {
      describe('when incrementing the counter', function () {
        before('increment the counter', async function () {
          const tx = await sample.incrementCounter(42)
          await tx.wait()
        })

        it('incremented the counter', async function () {
          assert.equal(await sample.counter(), 42)
        })

        describe('and then decrementing it', function () {
          before('decrement the counter', async function () {
            const tx = await sample.decrementCounter(42)
            await tx.wait()
          })

          it('decremented the counter', async function () {
            assert.equal(await sample.counter(), 0)
          })
        })
      })
    })

    describe('via the cli', function () {
      let abiPath
      let signer
      let balance

      before('find the abi', async function () {
        abiPath = path.resolve(
          process.cwd(),
          'artifacts/contracts/Sample.sol/Sample.json',
        )
      })

      before('get signer', async function () {
        const signers = await hre.ethers.getSigners()
        signer = signers[0]
      })

      const itPrintsPreliminaryInfo = () => {
        it('shows that the signer is connected and prints the correct initial balance', async function () {
          assert.ok(
            terminal.output.includes(
              `Connected signer ${signer.address} (${balance} ETH)`,
            ),
          )
        })

        it('printed a tx summary', async function () {
          assert.ok(terminal.output.includes('Pending Tx'))
          assert.ok(terminal.output.includes('Sample.incrementCounter('))
          assert.ok(terminal.output.includes(`Signer: ${signer.address}`))
          assert.ok(terminal.output.includes(`Balance: ${balance} ETH`))
          assert.ok(
            terminal.output.includes(`To: ${await sample.getAddress()}`),
          )
          assert.ok(terminal.output.includes('Value: 0 ETH'))
        })
      }

      const itPrintsPostTxInfo = () => {
        it('shows tx statuses', async function () {
          assert.ok(terminal.output.includes('Transaction sent'))
          assert.ok(terminal.output.includes('Transaction mined successfully'))
        })

        it('shows tx receipt', async function () {
          assert.ok(terminal.output.includes('Transaction Receipt'))
          assert.ok(terminal.output.includes('Tx hash:'))
          assert.ok(terminal.output.includes('Gas price:'))
          assert.ok(terminal.output.includes('Gas used:'))
          assert.ok(terminal.output.includes('Block number:'))
        })

        it('shows emitted events', async function () {
          assert.ok(terminal.output.includes('Emitted no events'))
        })

        it('shows shows final sender balance', async function () {
          const newBalance = await getBalance(signer.address)
          assert.ok(
            terminal.output.includes(`i Resulting balance: ${newBalance}`),
          )
        })
      }

      describe('when incrementing the counter', function () {
        describe('without prompting', function () {
          before('get initial balances', async function () {
            balance = await getBalance(signer.address)
          })

          before('run contract', async function () {
            await terminal.run(
              `npx hardhat interact contract --address ${await sample.getAddress()} --no-confirm --abi ${abiPath} --fn incrementCounter --params 42`,
              2000,
            )
          })

          itPrintsPreliminaryInfo()
          itPrintsPostTxInfo()

          it('incremented the counter', async function () {
            await terminal.run(
              `npx hardhat interact contract --address ${await sample.getAddress()} --abi ${abiPath} --fn counter`,
              1000,
            )
            console.log(terminal.output)
            assert.ok(terminal.output.includes('counter() => 42'))
          })

          describe('and then decrementing it', function () {
            before('run contract', async function () {
              await terminal.run(
                `npx hardhat interact contract --address ${await sample.getAddress()} --no-confirm --abi ${abiPath} --fn decrementCounter --params 42`,
                1000,
              )
            })

            it('decremented the counter', async function () {
              assert.equal(await sample.counter(), 0)
            })
          })
        })

        describe('with prompting', function () {
          before('get initial balances', async function () {
            balance = await getBalance(signer.address)
          })

          before('run contract', async function () {
            await terminal.run(
              `npx hardhat interact contract --address ${await sample.getAddress()} --abi ${abiPath} --fn incrementCounter --params 42`,
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

            it('incremented the counter', async function () {
              assert.equal(await sample.counter(), 42)
            })

            itPrintsPostTxInfo()
          })
        })
      })
    })
  })
})
