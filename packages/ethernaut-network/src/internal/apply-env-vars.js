const debug = require('common/src/debug')

module.exports = function applyEnvVars(url) {
  // Match https://some-url/${SOME_API_KEY}
  const regex = /\${(.*?)}/g

  url = url.replace(regex, (_, envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`Environment variable ${envVar} not found`)
    } else {
      debug.log(`Using environment variable ${envVar}`, 'network')
    }

    return process.env[envVar]
  })

  return url
}
