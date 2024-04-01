const { loadProject, muteOutput } = require('ethernaut-common/src/test/setup')

muteOutput()
loadProject('test/fixture-projects/basic-project')

// Fixes nyc not collecting coverage from subprocesses
require('../../ethernaut-interact/src/index')
