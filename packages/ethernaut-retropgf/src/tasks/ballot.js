const output = require('ethernaut-common/src/ui/output')
const { addRoundParam } = require('../internal/agora/utils/round-param')
const { getBallots } = require('../internal/agora/utils/ballots')
const similarity = require('string-similarity')
const types = require('ethernaut-common/src/validation/types')

const task = require('../scopes/retro')
  .task('ballot', 'Retrieves a specific ballot for a RetroPGF round')
  .addPositionalParam('id', 'The ballot id to query', '0', types.string)
  .setAction(async ({ id, round }) => {
    try {
      let ballots = await getBallots(round)

      const matches = similarity.findBestMatch(
        id,
        ballots.map((b) => `${b.ballotId}`),
      )

      if (!matches) {
        return output.resultBox('No ballot found')
      }

      const match = ballots.find(
        (p) => `${p.ballotId}` === matches.bestMatch.target,
      )

      return output.resultBox(JSON.stringify(match, null, 2))
    } catch (err) {
      return output.errorBox(err)
    }
  })

addRoundParam(task)
