const { Terminal } = require('ethernaut-common/src/terminal')
const getBalance = require('../../src/internal/get-balance')

describe('balance', function () {
  const terminal = new Terminal()

  let signer
  let balance

  before('get signers', async function () {
    const signers = await hre.ethers.getSigners()
    signer = signers[0]
  })

  describe('when querying ETH balance', function () {
    before('rec eth balance', async function () {
      balance = await getBalance(signer.address)
    })

    before('make call', async function () {
      await terminal.run(`npx hardhat interact balance ${signer.address}`)
    })

    it('shows the address', async function () {
      terminal.has('Address: ' + signer.address)
    })

    it('shows the token', async function () {
      terminal.has('Token: ETH')
    })

    it('shows the balance', async function () {
      terminal.has('Balance: ' + balance)
    })
  })

  describe('when querying a token balance', function () {
    let contract

    before('deploy token', async function () {
      const factory = await hre.ethers.getContractFactory('TestToken')
      contract = await factory.deploy('Test Token', 'TEST', 16)
    })

    before('rec eth balance', async function () {
      const rawBalance = await contract.balanceOf(signer.address)
      balance = hre.ethers.formatUnits(rawBalance, 16)
    })

    before('make call', async function () {
      const token = await contract.getAddress()
      await terminal.run(
        `npx hardhat interact balance ${signer.address} --token ${token}`,
      )
    })

    it('shows the token', async function () {
      const token = await contract.getAddress()
      terminal.has(`Token: ${token}`)
    })

    it('shows the balance', async function () {
      terminal.has('Balance: ' + balance)
    })
  })
})
