const debug = require('ethernaut-common/src/ui/debug')
const { checkEnvVar } = require('ethernaut-common/src/io/env')

module.exports = async function applyEnvVars(url) {
  // Match https://some-url/${SOME_API_KEY}
  const regex = /\${(.*?)}/g

  url = url.replace(regex, async (_, envVar) => {
    if (!process.env[envVar]) {
      await checkEnvVar(envVar, `This is required by the provider url ${url}`)
    } else {
      debug.log(`Using environment variable ${envVar}`, 'network')
    }

    return process.env[envVar]
  })

  return url
}
