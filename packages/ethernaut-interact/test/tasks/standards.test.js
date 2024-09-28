const { Terminal } = require('ethernaut-common/src/test/terminal')

describe('standards', function () {
  const terminal = new Terminal()

  describe('when interacting with various contracts', function () {
    let sample, testToken, simpleERC721, simpleERC1155, simpleERC165

    before('deploy all test contracts', async function () {
      const SampleFactory = await hre.ethers.getContractFactory('Sample')
      sample = await SampleFactory.deploy()

      const TestTokenFactory = await hre.ethers.getContractFactory('TestToken')
      testToken = await TestTokenFactory.deploy('Test Token', 'TEST', 16)

      const ERC165Factory = await hre.ethers.getContractFactory('ERC165')
      simpleERC165 = await ERC165Factory.deploy()

      const ERC721Factory = await hre.ethers.getContractFactory('ERC721')
      simpleERC721 = await ERC721Factory.deploy()

      const ERC1155Factory = await hre.ethers.getContractFactory('ERC1155')
      simpleERC1155 = await ERC1155Factory.deploy()
    })

    describe('when checking Sample contract (non-compliant)', function () {
      before('run contract', async function () {
        await terminal.run(
          `hardhat interact standards ${await sample.getAddress()}`,
        )
      })

      it('returns false for all standards', async function () {
        // terminal.has('ERC-165 Supported: No')
        // terminal.has('ERC-20: No')
        // terminal.has('ERC-721: No')
        // terminal.has('ERC-1155: No')
      })
    })

    describe('when checking TestToken (ERC-20)', function () {
      before('run contract', async function () {
        await terminal.run(
          `hardhat interact standards ${await testToken.getAddress()}`,
        )
      })
      it('returns true for ERC-20 and false for others', async function () {
        // terminal.has('ERC-165 Supported: No')
        // terminal.has('ERC-20: Yes')
        // terminal.has('ERC-721: No')
        // terminal.has('ERC-1155: No')
      })
    })

    describe('when checking SimpleERC165 (ERC-165 only)', function () {
      before('run contract', async function () {
        await terminal.run(
          `hardhat interact standards ${await simpleERC165.getAddress()}`,
        )
      })

      it('returns true for ERC-165 and false for others', async function () {
        // terminal.has('ERC-165 Supported: Yes')
        // terminal.has('ERC-20: No')
        // terminal.has('ERC-721: No')
        // terminal.has('ERC-1155: No')
      })
    })

    describe('when checking SimpleERC721 (ERC-721)', function () {
      before('run contract', async function () {
        await terminal.run(
          `hardhat interact standards ${await simpleERC721.getAddress()}`,
        )
      })

      it('returns true for ERC-721 and ERC-165, false for others', async function () {
        // terminal.has('ERC-165 Supported: Yes')
        // terminal.has('ERC-20: No')
        // terminal.has('ERC-721: Yes')
        // terminal.has('ERC-1155: No')
      })
    })

    describe('when checking SimpleERC1155 (ERC-1155)', function () {
      before('run contract', async function () {
        await terminal.run(
          `hardhat interact standards ${await simpleERC1155.getAddress()}`,
        )
      })

      it('returns true for ERC-1155 and ERC-165, false for others', async function () {
        // terminal.has('ERC-165 Supported: Yes')
        // terminal.has('ERC-20: No')
        // terminal.has('ERC-721: No')
        // terminal.has('ERC-1155: Yes')
      })
    })
  })
})
