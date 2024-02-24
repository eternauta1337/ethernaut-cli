const { task } = require('hardhat/config')
const navigateFrom = require('../internal/navigate-from')
const output = require('common/src/output')

task('help', 'Jumps into the help navigator').setAction(
  async (args, hre, runSuper) => {
    try {
      const hasHelpOption = process.argv.some(
        (el) => el === '--help' || el === '-h' || el === 'help',
      )
      if (hasHelpOption) {
        return runSuper(args, hre, runSuper)
      }

      if (process.argv.length >= 3) {
        const scope = process.argv[2]
        await navigateFrom(hre.scopes[scope] || hre)
      } else {
        await navigateFrom(hre)
      }
    } catch (err) {
      output.errorBox(err)
    }
  },
)
