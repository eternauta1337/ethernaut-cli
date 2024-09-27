const { Terminal } = require('ethernaut-common/src/test/terminal')

describe('standards', function () {
  const terminal = new Terminal()

  describe('when interacting with various contracts', function () {
    let sample, testToken, simpleERC721, simpleERC1155, simpleERC165

    before('deploy all test contracts', async function () {
      const Sample = await hre.ethers.getContractFactory('Sample')
      sample = await Sample.deploy()

      const TestToken = await hre.ethers.getContractFactory('TestToken')
      testToken = await TestToken.deploy('Test Token', 'TEST', 16)

      const SimpleERC165 = await hre.ethers.getContractFactory('ERC165')
      simpleERC165 = await SimpleERC165.deploy()

      const SimpleERC721 = await hre.ethers.getContractFactory('ERC721')
      simpleERC721 = await SimpleERC721.deploy()

      const SimpleERC1155 = await hre.ethers.getContractFactory('ERC1155')
      simpleERC1155 = await SimpleERC1155.deploy()
    })

    describe('when checking Sample contract (non-compliant)', function () {
      it('returns false for all standards', async function () {
        await terminal.run(
          `hardhat interact standards  ${await sample.getAddress()}`,
        )
        terminal.has('ERC-165 Supported: No')
        terminal.has('ERC-20: No')
        terminal.has('ERC-721: No')
        terminal.has('ERC-1155: No')
      })
    })

    describe('when checking TestToken (ERC-20)', function () {
      it('returns true for ERC-20 and false for others', async function () {
        await terminal.run(
          `hardhat interact standards  ${await testToken.getAddress()}`,
        )
        terminal.has('ERC-165 Supported: No')
        terminal.has('ERC-20: Yes')
        terminal.has('ERC-721: No')
        terminal.has('ERC-1155: No')
      })
    })

    describe('when checking SimpleERC165 (ERC-165 only)', function () {
      this.timeout(10000) // Increase timeout to 10 seconds
      it('returns true for ERC-165 and false for others', async function () {
        const address = await simpleERC165.getAddress()
        console.log(`SimpleERC165 Address: ${address}`)
        const result = await terminal.run(
          `hardhat interact standards ${address}`,
        )
        console.log(`Result: ${result}`)
        terminal.has('ERC-165 Supported: Yes')
        terminal.has('ERC-20: No')
        terminal.has('ERC-721: No')
        terminal.has('ERC-1155: No')
      })
    })

    describe('when checking SimpleERC721 (ERC-721)', function () {
      this.timeout(10000) // Increase timeout to 10 seconds
      it('returns true for ERC-721 and ERC-165, false for others', async function () {
        const address = await simpleERC721.getAddress()
        console.log(`SimpleERC721 Address: ${address}`)
        const result = await terminal.run(
          `hardhat interact standards ${address}`,
        )
        console.log(`Result: ${result}`)
        terminal.has('ERC-165 Supported: Yes')
        terminal.has('ERC-20: No')
        terminal.has('ERC-721: Yes')
        terminal.has('ERC-1155: No')
      })
    })

    describe('when checking SimpleERC1155 (ERC-1155)', function () {
      it('returns true for ERC-1155 and ERC-165, false for others', async function () {
        await terminal.run(
          `hardhat interact standards  ${await simpleERC1155.getAddress()}`,
        )
        terminal.has('ERC-165 Supported: Yes')
        terminal.has('ERC-20: No')
        terminal.has('ERC-721: No')
        terminal.has('ERC-1155: Yes')
      })
    })
  })
})
