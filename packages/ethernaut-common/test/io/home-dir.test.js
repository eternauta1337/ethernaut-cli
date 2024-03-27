const os = require('os')
const assert = require('assert')
const replaceHomeDir = require('../../src/io/home-dir')

describe('home-dir', function () {
  describe('replaceHomeDir', function () {
    let homeDir

    before('get home dir', async function () {
      homeDir = os.homedir()
    })

    it('replaces correctly', async function () {
      assert.equal(replaceHomeDir(`${homeDir}/something`), '~/something')
    })
  })
})
