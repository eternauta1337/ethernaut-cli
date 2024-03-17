module.exports = async function copyToClipboard(txt) {
  let clipboardy = await import('clipboardy')
  clipboardy = clipboardy.default || clipboardy
  clipboardy.writeSync(txt)
}
