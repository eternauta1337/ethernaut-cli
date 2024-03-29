const fs = require('fs')
const path = require('path')
const { prompt } = require('ethernaut-common/src/ui/prompt')
const dotenv = require('dotenv')
const debug = require('ethernaut-common/src/ui/debug')
const { getEthernautFolderPath } = require('ethernaut-common/src/io/storage')

const envPath = path.join(getEthernautFolderPath(), '.env')

function refreshEnv() {
  require('dotenv').config({ path: envPath })
}

async function checkEnvVar(varName, message) {
  if (process.env[varName]) {
    debug.log(`Environment variable ${varName} found`, 'env')
    return
  }

  debug.log(`Environment variable ${varName} not found - collecting it...`)

  if (!fs.existsSync(envPath)) {
    debug.log('No .env file found, creating one...', 'env')
    fs.writeFileSync(envPath, '')
  }

  const envConfig = dotenv.parse(fs.readFileSync(envPath))
  if (!envConfig[varName]) {
    const varValue = await prompt({
      type: 'input',
      message: `Please provide a value for ${varName}${message ? `. ${message}` : ''}`,
    })
    debug.log(`Saved environment variable ${varName} in .env file...`)
    fs.appendFileSync(envPath, `${varName}=${varValue}`)
    require('dotenv').config({ path: envPath })
  }
}

module.exports = {
  refreshEnv,
  checkEnvVar,
}
