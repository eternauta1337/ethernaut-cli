const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const { getChainId } = require('ethernaut-common/src/util/network')
const { connect, getLevelContract } = require('../internal/connect')
const { prompt } = require('ethernaut-common/src/ui/prompt')
const { buildProof } = require('zeronaut-contracts/utils/build-proof')

require('../scopes/zeronaut')
  .task('play-level', 'Plays a level')
  .addPositionalParam(
    'name',
    'The name of level to play',
    undefined,
    types.string,
  )
  .setAction(async ({ name }, hre) => {
    try {
      // Retrieve the game contract
      const chainId = await getChainId(hre)
      const contract = await connect(`chain-${chainId}`, hre)

      // Retrieve the level address
      const levelId = hre.ethers.encodeBytes32String(name)
      const levelData = await contract.getLevel(levelId)
      const levelAddress = levelData.addr

      // Connect to the level contract
      const level = await getLevelContract(hre, levelAddress)

      // Retrieve the level circuit
      const levelCircuitData = await level.circuit()

      // Build the circuit and collect the parameters
      const circuit = JSON.parse(levelCircuitData)
      const { inputs, publicInputs } = await _collectInputs(circuit.abi)

      // Retrieve the signer
      const signer = (await hre.ethers.getSigners())[0]

      // Build the proof
      const { proof, publicInputs: morePublicInputs } = await buildProof(
        signer,
        circuit,
        inputs,
      )
      publicInputs.push(...morePublicInputs)

      // Check the proof
      const success = await level.check(proof, publicInputs)
      console.log('Check proof:', success)

      // Submit the proof
      const tx = await contract.solveLevel(levelId, proof, publicInputs)
      await tx.wait()

      return output.resultBox(`Level solved: ${success}`)
    } catch (err) {
      return output.errorBox(err)
    }
  })

async function _collectInputs(abi) {
  // console.log(JSON.stringify(abi, null, 2))

  const inputs = {}
  const publicInputs = []

  for (const param of abi.parameters) {
    // Do not collect signature stuff
    if (
      param.name === 'signature' ||
      param.name === 'pubKeyX' ||
      param.name === 'pubKeyY' ||
      param.name === 'hashedMsg'
    ) {
      continue
    }

    // Collect value with prompt
    const value = await prompt({
      type: 'input',
      name: param.name,
      message: `Enter the value for ${param.name}`,
    })

    // Parse and store value
    if (param.type.kind === 'integer') {
      inputs[param.name] = hre.ethers.zeroPadValue(
        hre.ethers.toBeHex(value),
        32,
      )
    } else {
      inputs[param.name] = value
    }

    // Identify public inputs
    if (param.visibility !== 'private') {
      publicInputs.push(inputs[param.name])
    }
  }

  return { inputs, publicInputs }
}
