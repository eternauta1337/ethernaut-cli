const output = require('ethernaut-common/src/ui/output')
const { getLatestRound } = require('../internal/agora/utils/latest-round')
const types = require('ethernaut-common/src/validation/types')
const Agora = require('../internal/agora/Agora')

require('../scopes/retro')
  .task('metric', 'Retrieves a specific impact metric for a RetroPGF round')
  .addParam(
    'round',
    'The round number to query. Defaults to "latest"',
    'latest',
    types.string,
  )
  .addParam('id', 'The metric id')
  .setAction(async ({ id, round }) => {
    try {
      const roundId = round === 'latest' ? await getLatestRound() : round

      const agora = new Agora()
      const metric = await agora.retro.impactMetric({
        roundId,
        impactMetricId: id,
      })

      return output.resultBox(JSON.stringify(metric, null, 2))
    } catch (err) {
      return output.errorBox(err)
    }
  })
