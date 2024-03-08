const fs = require('fs')
const path = require('path')
const prompt = require('ethernaut-common/src/prompt')
const dotenv = require('dotenv')
const debug = require('ethernaut-common/src/debug')

async function checkEnvVar(varName, message) {
  if (process.env[varName]) {
    debug.log(`Environment variable ${varName} found`)
    return
  }

  debug.log(`Environment variable ${varName} not found - collecting it...`)

  const envPath = path.join(process.cwd(), '.env')
  if (!fs.existsSync(envPath)) {
    debug.log('No .env file found, creating one...')
    fs.writeFileSync(envPath, '')
  }

  const envConfig = dotenv.parse(fs.readFileSync(envPath))
  if (!envConfig[varName]) {
    const varValue = await prompt({
      type: 'input',
      message: `Please provide a value for ${varName}${message ? `. ${message}` : ''}`,
    })
    debug.log(`Saved environment variable ${varName} in .env file...`)
    fs.appendFileSync(envPath, `\n${varName}=${varValue}`)
    require('dotenv').config({ path: envPath })
  }
}

module.exports = checkEnvVar
