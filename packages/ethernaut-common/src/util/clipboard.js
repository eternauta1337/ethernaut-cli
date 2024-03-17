const { copy } = require('copy-paste')

module.exports = function copyToClipboard(txt) {
  copy(txt)
}
