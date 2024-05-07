const { getRoundNumber } = require('./latest-round')
const Agora = require('../Agora')
const EthernautCliError = require('ethernaut-common/src/error/error')

async function getMetrics(round) {
  const agora = new Agora()

  if (round === 'any') {
    throw new EthernautCliError('ethernaut-retropgf', 'Invalid round specifier')
  }

  const roundId = await getRoundNumber(round)

  return agora.retro.roundImpactMetrics({ roundId })
}

module.exports = {
  getMetrics,
}
