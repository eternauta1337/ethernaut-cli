const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const { getLatestRound } = require('../internal/agora/utils/latest-round')
const Agora = require('../internal/agora/Agora')

require('../scopes/retro')
  .task(
    'ballots',
    'Retrieves a list of ballots for a RetroPGF round, given the specified filters',
  )
  .addParam(
    'round',
    'The round number to query. Defaults to "latest"',
    'latest',
    types.string,
  )
  .addOptionalParam(
    'caster',
    'Filter by the address of the ballot caster',
    undefined,
    types.string,
  )
  .setAction(async ({ caster, round }) => {
    try {
      const roundId = round === 'latest' ? await getLatestRound() : round

      let ballots = await getBallots(roundId)
      ballots = filterBallots(ballots, caster)

      return output.resultBox(printBallots(ballots))
    } catch (err) {
      return output.errorBox(err)
    }
  })

function filterBallots(ballots, caster) {
  if (caster) {
    ballots = ballots.filter((b) => {
      return b.ballotCasterAddress.toLowerCase() === caster.toLowerCase()
    })
  }

  return ballots
}

function printBallots(ballots) {
  const strs = []

  for (const ballot of ballots) {
    strs.push(`- ${ballot.ballotId} (${ballot.ballotCasterAddress})`)
  }

  return strs.join('\n')
}

async function getBallots(roundId) {
  const agora = new Agora()

  return await agora.retro.ballots({ roundId })
}
