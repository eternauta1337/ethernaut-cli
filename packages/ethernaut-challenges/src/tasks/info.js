const { types } = require('hardhat/config')
const helper = require('../internal/helper')
const fs = require('fs')
const path = require('path')
const output = require('common/src/output')
const debug = require('common/src/debug')
const replaceHomeDir = require('common/src/home-dir')
const getNetworkName = require('common/src/network')

require('../scopes/oz')
  .task(
    'info',
    'Shows information about an open zeppelin challenges level. The info includes the level name, contract name, ABI path, address, and description. The ABI path can be used with the interact package call task to interact with the contract.',
  )
  .addOptionalPositionalParam(
    'level',
    'The level number',
    undefined,
    types.string,
  )
  .setAction(async ({ level }) => {
    try {
      const info = await getLevelInfo(level)

      let str = ''

      str += output.infoBox(info.description, 'Description')
      if (info.revealCode) {
        str += output.infoBox(info.source, 'Source Code')
      }
      str += output.resultBox(
        `Level name: ${info.name}\n` +
          `Contract name: ${info.contractName}.sol\n` +
          `ABI path: ${info.abi}\n` +
          `Address: ${info.levelAddress}`,
        `Ethernaut Challenge #${level}`,
      )

      return str
    } catch (err) {
      return output.errorBox(err)
    }
  })

async function getLevelInfo(level) {
  const idx = parseInt(level) - 1
  if (idx < 0) {
    throw new Error('Invalid level number')
  }

  const gamedata = helper.getGamedata()
  const levelInfo = gamedata.levels[idx]
  if (!levelInfo) {
    throw new Error(`Level ${level} not found`)
  }
  debug.log(`Level info: ${JSON.stringify(levelInfo, null, 2)}`, 'challenges')

  const name = levelInfo.name
  const contractName = levelInfo.instanceContract.split('.')[0]

  const abi = replaceHomeDir(
    path.join(helper.getAbisPath(), `${contractName}.json`),
  )

  const sourcePath = path.join(helper.getSourcesPath(), `${contractName}.sol`)
  const source = fs.readFileSync(sourcePath, 'utf8')

  const description = helper.getLevelDescription(levelInfo.description)

  const network = await getNetworkName(hre)
  const deploymentInfo = helper.getDeploymentInfo(network)
  const levelAddress = deploymentInfo[level]

  return {
    name,
    contractName,
    abi,
    levelAddress,
    source,
    description,
    revealCode: levelInfo.revealCode,
  }
}
