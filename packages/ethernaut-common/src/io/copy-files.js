const fs = require('fs-extra')
const path = require('path')
const debug = require('ethernaut-common/src/ui/debug')
const EthernautCliError = require('ethernaut-common/src/error/error')

module.exports = function copyFiles(src, dst) {
  debug.log(`Copying files from ${src} to ${dst}`, 'common')

  if (!fs.existsSync(src)) {
    throw new EthernautCliError(
      'ethernaut-common',
      `Source directory ${src} does not exist`,
    )
  }

  fs.ensureDirSync(dst)

  fs.readdirSync(src).forEach((file) => {
    const srcFilePath = path.join(src, file)
    const dstFilePath = path.join(dst, file)
    if (fs.existsSync(dstFilePath)) {
      debug.log(
        `Skipping copy of ${dstFilePath} as it already exists`,
        'common',
      )
    } else {
      fs.copySync(srcFilePath, dstFilePath)
    }
  })
}
