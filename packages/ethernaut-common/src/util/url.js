function isUrl(url) {
  return /^https?:\/\/\S+$/.test(url)
}

module.exports = {
  isUrl,
}
