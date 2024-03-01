const fs = require('fs')
const path = require('path')
const rootDir = path.join(__dirname, '..')
const nodeModulesDir = path.join(rootDir, 'packages')
const hardhatLink = path.join(rootDir, 'node_modules/hardhat/')

console.log(
  '\n\nWARNING!!! Modifying hardhat. This is a temporary fix. Remove after https://github.com/NomicFoundation/hardhat/pull/4951 is merged and released.\n\n',
)

function fixCliJs() {
  const filePath = path.join(
    __dirname,
    '..',
    'node_modules/hardhat/internal/cli/cli.js',
  )

  fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      return console.log(err)
    }

    const lines = data.split('\n')

    const line1 =
      '        const env = new runtime_environment_1.Environment(resolvedConfig, hardhatArguments, taskDefinitions, scopesDefinitions, envExtenders, ctx.experimentalHardhatNetworkMessageTraceHooks, userConfig, providerExtenders);'
    const line2 = '        ctx.setHardhatRuntimeEnvironment(env);'
    const line3 =
      '        let { scopeName, taskName, unparsedCLAs } = argumentsParser.parseScopeAndTaskNames(allUnparsedCLAs, taskDefinitions, scopesDefinitions);'

    const index1 = lines.indexOf(line1)
    const index2 = lines.indexOf(line2)
    const index3 = lines.indexOf(line3)

    if (index1 < index3 && index2 < index3) {
      // The lines are in the correct order, do nothing
      return
    }

    // Remove the lines from their current positions
    lines.splice(index1, 1)
    lines.splice(index2 - 1, 1) // Subtract 1 because we just removed a line before this one

    // Find the new index of line3
    const newIndex3 = lines.indexOf(line3)

    // Insert the lines at the correct positions
    lines.splice(newIndex3, 0, line1, line2)

    const newData = lines.join('\n')

    fs.writeFile(filePath, newData, 'utf8', function (err) {
      if (err) {
        return console.log(err)
      }
    })
  })
}

function replaceHardhatLinks(dir) {
  fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log(err)
      return
    }

    files.forEach((file) => {
      const fullPath = path.join(dir, file.name)

      if (file.isDirectory()) {
        if (file.name === 'hardhat') {
          fs.rmdir(fullPath, { recursive: true }, (err) => {
            if (err) {
              console.log(err)
              return
            }

            fs.symlink(hardhatLink, fullPath, (err) => {
              if (err) {
                console.log(err)
                return
              }

              console.log(`Replaced ${fullPath} with a link to ${hardhatLink}`)
            })
          })
        } else {
          replaceHardhatLinks(fullPath)
        }
      }
    })
  })
}

fixCliJs()
replaceHardhatLinks(nodeModulesDir)
