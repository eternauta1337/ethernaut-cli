const { copy } = require('copy-paste');

function copyToClipboard(value) {
  copy(value, () => {});
}

module.exports = {
  copyToClipboard,
};
