const { task } = require('hardhat/config')
const navigateFrom = require('../internal/navigate-from')
const output = require('ethernaut-common/src/ui/output')
const { HelpPrinter } = require('hardhat/internal/cli/HelpPrinter')

task('help', 'Jumps into the help navigator').setAction(
  async (args, hre, runSuper) => {
    try {
      const hasHelpOption = process.argv.some(
        (el) => el === '--help' || el === '-h' || el === 'help',
      )
      if (hasHelpOption) {
        modifyHelpPrinter()
        return runSuper(args, hre, runSuper)
      }

      // Navigate with scope
      if (process.argv.length >= 3) {
        const scope = process.argv[2]
        await navigateFrom(hre.scopes[scope] || hre, hre)
      } else {
        // Without scope
        await navigateFrom(hre, hre)
      }
    } catch (err) {
      return output.errorBox(err)
    }
  },
)

// Modify HelpPrinter so that the --non-interactive flag is
// shown as a global hardhat option.
function modifyHelpPrinter() {
  const originalPrintGlobalHelp = HelpPrinter.prototype.printGlobalHelp

  HelpPrinter.prototype.printGlobalHelp = function (includeSubtasks = false) {
    this._hardhatParamDefinitions.nonInteractive = {
      name: '--non-interactive',
      defaultValue: false,
      description: 'Disable interactive parameter collection prompts',
      type: 'boolean',
      isOptional: true,
      isFlag: true,
      isVariadic: false,
    }
    return originalPrintGlobalHelp.call(this, includeSubtasks)
  }
}
