const EthernautCliError = require('ethernaut-common/src/error/error')
const Agora = require('../Agora')
const { getLatestRound } = require('./rounds')

async function getBallots(round) {
  const agora = new Agora()

  if (round === 'any') {
    throw new EthernautCliError(
      'ethernaut-retropgf',
      'Any round is not supported',
    )
  }

  if (round === 'latest') {
    return await agora.retro.ballots({
      roundId: await getLatestRound(),
    })
  }

  return await agora.retro.ballots({ roundId: round })
}

module.exports = {
  getBallots,
}
