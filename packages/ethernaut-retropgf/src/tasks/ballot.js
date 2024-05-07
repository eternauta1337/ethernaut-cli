const output = require('ethernaut-common/src/ui/output')
const Agora = require('../internal/agora/Agora')
const types = require('ethernaut-common/src/validation/types')
const { getLatestRound } = require('../internal/agora/utils/latest-round')

require('../scopes/retro')
  .task('ballot', 'Retrieves a specific ballot for a RetroPGF round')
  .addParam(
    'round',
    'The round number to query. Defaults to "latest"',
    'latest',
    types.string,
  )
  .addParam(
    'caster',
    'The address of the ballot caster',
    undefined,
    types.string,
  )
  .setAction(async ({ caster, round }) => {
    try {
      const roundId = round === 'latest' ? await getLatestRound() : round

      const agora = new Agora()
      let ballot = await agora.retro.ballot({
        roundId,
        ballotCasterAddressOrEns: caster,
      })

      return output.resultBox(JSON.stringify(ballot, null, 2))
    } catch (err) {
      return output.errorBox(err)
    }
  })
