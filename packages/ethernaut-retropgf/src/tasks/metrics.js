const types = require('ethernaut-common/src/validation/types')
const output = require('ethernaut-common/src/ui/output')
const { getMetrics } = require('../internal/agora/utils/metrics')

require('../scopes/retro')
  .task('metrics', 'Retrieves a list of impact metrics for a RetroPGF round')
  .addParam(
    'round',
    'The round number to query. Defaults to "latest". Can also be a number > 0.',
    'latest',
    types.string,
  )
  .setAction(async ({ round }) => {
    try {
      let metrics = await getMetrics(round)

      return output.resultBox(printMetrics(metrics), 'Impact Metrics')
    } catch (err) {
      return output.errorBox(err)
    }
  })

function printMetrics(metrics) {
  const strs = []

  for (const metric of metrics) {
    strs.push(`- ${metric.name} (${metric.description})`)
  }

  return strs.join('\n')
}
