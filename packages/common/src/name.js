function validateVarName(name) {
  const regex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/
  console.log(name, regex.test(name))
  return regex.test(name)
}

module.exports = {
  validateVarName,
}
