const output = require('ethernaut-common/src/ui/output')
const Agora = require('../internal/agora/Agora')
const { getLatestRound } = require('../internal/agora/utils/latest-round')

require('../scopes/retro')
  .task('metrics', 'Retrieves a list of impact metrics for a RetroPGF round')
  .setAction(async ({ round }) => {
    try {
      const roundId = round === 'latest' ? await getLatestRound() : round

      const metrics = await getMetrics(roundId)

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

async function getMetrics(roundId) {
  const agora = new Agora()

  return agora.retro.roundImpactMetrics({ roundId })
}
