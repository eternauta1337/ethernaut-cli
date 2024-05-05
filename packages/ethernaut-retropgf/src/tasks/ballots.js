const output = require('ethernaut-common/src/ui/output')
const { addRoundParam } = require('../internal/agora/utils/round-param')
const { getBallots } = require('../internal/agora/utils/ballots')

const task = require('../scopes/retro')
  .task('ballots', 'Retrieves a list of ballots for a RetroPGF round')
  .setAction(async ({ round }) => {
    try {
      let ballots = await getBallots(round)
      console.log(JSON.stringify(ballots, null, 2))

      return output.resultBox(printBallots(ballots))
    } catch (err) {
      return output.errorBox(err)
    }
  })

function printBallots(ballots) {
  const strs = []

  for (const ballot of ballots) {
    strs.push(`- ${ballot.ballotId} (${ballot.ballotCasterAddress})`)
  }

  return strs.join('\n')
}

addRoundParam(task)
