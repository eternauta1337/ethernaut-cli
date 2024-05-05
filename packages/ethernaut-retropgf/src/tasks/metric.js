const output = require('ethernaut-common/src/ui/output')
const { getMetrics } = require('../internal/agora/utils/metrics')
const similarity = require('string-similarity')
const { addRoundParam } = require('../internal/agora/utils/round-param')

const task = require('../scopes/retro')
  .task('metric', 'Retrieves a specific impact metric for a RetroPGF round')
  .addPositionalParam('name', 'The metric name to query')
  .setAction(async ({ name }) => {
    try {
      let metrics = await getMetrics()

      const matches = similarity.findBestMatch(
        name,
        metrics.map((p) => p.name),
      )

      if (!matches) {
        return output.resultBox('No metric found')
      }

      const match = metrics.find((p) => p.name === matches.bestMatch.target)

      return output.resultBox(JSON.stringify(match, null, 2))
    } catch (err) {
      return output.errorBox(err)
    }
  })

addRoundParam(task)
