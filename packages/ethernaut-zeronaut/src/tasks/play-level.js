const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const { getChainId } = require('ethernaut-common/src/util/network')
const { connect } = require('../internal/connect')
const { prompt } = require('ethernaut-common/src/ui/prompt')

require('../scopes/zeronaut')
  .task('play-level', 'Plays a level')
  .addPositionalParam(
    'campaign',
    'The name of the campaign',
    undefined,
    types.string,
  )
  .addPositionalParam(
    'level',
    'The index of level to play',
    undefined,
    types.string,
  )
  .setAction(async ({ campaign, level }, hre) => {
    try {
      // Retrieve the game contract
      const chainId = await getChainId(hre)
      const contract = await connect(`chain-${chainId}`, hre)

      // Retrieve the campaign
      const id = hre.ethers.encodeBytes32String(campaign)
      const campaignData = await contract.getCampaign(id)

      // Retrieve the level
      const levelAddress = campaignData.levels[level]
      const levelCircuitData = await contract.getLevelCircuit(levelAddress)

      // Build the circuit and collect the parameters
      const circuit = JSON.parse(levelCircuitData)
      const { inputs, publicInputs } = await _collectInputs(circuit.abi)
      // console.log('inputs', inputs)
      // console.log('publicInputs', publicInputs)

      // Build the proof
      const proof = await _buildProof(circuit, inputs)
      // console.log('proof', proof)

      // Submit the proof to the contract
      const success = await contract.checkLevel(
        levelAddress,
        proof,
        publicInputs,
      )

      return output.resultBox(`Success: ${success}`)
    } catch (err) {
      return output.errorBox(err)
    }
  })

async function _buildProof(circuit, inputs) {
  const { Noir } = await import('@noir-lang/noir_js')
  const { BarretenbergBackend } = await import(
    '@noir-lang/backend_barretenberg'
  )
  const noirFrontend = new Noir(circuit)
  const noirBackend = new BarretenbergBackend(circuit)

  // Generate a witness for the circuit
  const { witness } = await noirFrontend.execute(inputs)
  // console.log('Witness:', witness);

  // Generate a proof for the witness
  const proofData = await noirBackend.generateProof(witness)
  // console.log('Proof:', proofData);

  // Verify the proof
  const verification = await noirBackend.verifyProof(proofData)
  if (!verification) {
    throw new Error('Proof verification failed')
  }
  // console.log('Verification:', verification)

  return '0x' + Buffer.from(proofData.proof).toString('hex')
}

async function _collectInputs(abi) {
  // console.log(JSON.stringify(abi, null, 2))

  const inputs = {}
  const publicInputs = []

  for (const param of abi.parameters) {
    if (param.type.kind === 'string') {
      const value = await prompt({
        type: 'input',
        name: param.name,
        message: `Enter the value for ${param.name}`,
      })

      inputs[param.name] = value

      if (param.visibility !== 'private') {
        publicInputs.push('0x' + Buffer.from(value).toString('hex'))
      }
    } else {
      throw new Error(`Unsupported parameter type: ${param.type}`)
    }
  }

  return { inputs, publicInputs }
}
