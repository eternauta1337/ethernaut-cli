const fs = require('fs')
const path = require('path')
const { prompt } = require('ethernaut-common/src/ui/prompt')
const dotenv = require('dotenv')
const debug = require('ethernaut-common/src/ui/debug')
const { getEthernautFolderPath } = require('ethernaut-common/src/io/storage')

const envPath = path.join(getEthernautFolderPath(), '.env')

function refreshEnv() {
  // Create the .env file if it doesn't exist
  if (!fs.existsSync(envPath)) {
    debug.log('No .env file found, creating one...', 'env')
    fs.writeFileSync(envPath, '')
  }

  // Load the .env file
  require('dotenv').config({ path: envPath })
}

async function checkEnvVar(varName, message) {
  refreshEnv()

  // Check if the env var exists at runtime
  if (process.env[varName]) {
    debug.log(`Environment variable ${varName} found`, 'env')
    return
  }
  debug.log(`Environment variable ${varName} not found - collecting it...`)

  // Collect the env var from the user
  const varValue = await prompt({
    type: 'input',
    message: `Please provide a value for ${varName}${message ? `. ${message}` : ''}`,
  })

  // Save the env var to the .env file
  setEnvVar(varName, varValue)
}

function loadEnvConfig() {
  return dotenv.parse(fs.readFileSync(envPath))
}

function setEnvVar(varName, varValue) {
  // Load and set the env var
  const envConfig = loadEnvConfig()
  envConfig[varName] = varValue

  // Write the env var to the .env file
  let envFileContent = ''
  for (const [key, value] of Object.entries(envConfig)) {
    envFileContent += `${key}=${value}\n`
  }
  fs.writeFileSync(envPath, envFileContent)
  debug.log(`Saved environment variable ${varName} in .env file...`)

  process.env[varName] = varValue
  refreshEnv()
}

module.exports = {
  refreshEnv,
  checkEnvVar,
  setEnvVar,
}
