const isBytes32 = (str) => {
  const regex = /^0x[a-fA-F0-9]{64}$/
  return regex.test(str)
}

module.exports = {
  isBytes32,
}
