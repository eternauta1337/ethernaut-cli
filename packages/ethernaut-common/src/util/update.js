const fetch = require('node-fetch')
const semver = require('semver')
const storage = require('../io/storage')

function checkUpdate(pkg) {
  const config = storage.readConfig()

  // Fetch latest version for next time
  fetch(`https://registry.npmjs.org/${pkg.name}/latest`)
    .then((response) => response.json())
    .then((data) => {
      config.general.latestVersion = data.version
      storage.saveConfig(config)
    })
    .catch(() => {})

  // Previously recorded a later version?
  if (
    config.general.latestVersion &&
    semver.gt(config.general.latestVersion, pkg.version)
  ) {
    return config.general.latestVersion
  }
}

module.exports = {
  checkUpdate,
}
