// const { types } = require('hardhat/config')
const output = require('common/src/output')
// const autocompleteUrl = require('./autocomplete/url')
// const storage = require('../internal/storage')

require('../scopes/sig')
  .task('add', 'Adds a signer')
  .setAction(async () => {
    try {
      console.log('add signer')
    } catch (err) {
      return output.errorBox(err)
    }
  })

// add.paramDefinitions.url.autocomplete = autocompleteUrl
