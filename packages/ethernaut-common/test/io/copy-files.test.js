const fs = require('fs-extra')
const path = require('path')
const assert = require('assert')
const copyFiles = require('../../src/io/copy-files')

describe('copy-files', function () {
  describe('copyFiles', function () {
    let src
    let dst

    before('id src and dst', async function () {
      src = path.resolve(__dirname, '../fixture-projects/basic-project')
      dst = path.resolve(__dirname, '../fixture-projects/basic-project-copy')
    })

    before('copy files', async function () {
      copyFiles(src, dst)
    })

    after('delete files', async function () {
      if (fs.existsSync(dst)) {
        fs.rmdirSync(dst, { recursive: true })
      }
    })

    it('created the dst folder', async function () {
      assert.ok(fs.existsSync(dst))
    })

    it('copied the files', async function () {
      const files = fs.readdirSync(dst)
      assert.ok(files.includes('hardhat.config.js'))
      assert.ok(files.includes('package.json'))
    })
  })
})
