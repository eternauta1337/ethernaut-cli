const EthernautCliError = require('ethernaut-common/src/error/error')

function findLineWith(text, fullText) {
  // Escape special characters in the lineStart string to safely use it in a regular expression
  const escapedLineStart = text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')

  // Construct a dynamic regular expression using the escaped lineStart
  // The 'm' flag is used to perform multiline matching
  const regex = new RegExp(`^${escapedLineStart}(.*)$`, 'm')

  const match = fullText.match(regex)

  // If a match is found, return the captured group, trimmed of whitespace
  if (match) {
    return match[1].trim()
  } else {
    throw new EthernautCliError(
      'ethernaut-common',
      `Line starting with "${text}" not found`,
    )
  }
}

module.exports = {
  findLineWith,
}
