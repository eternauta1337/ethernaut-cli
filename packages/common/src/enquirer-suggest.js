module.exports = function suggest(input, choices) {
  return choices.filter((choice) => {
    return choice.value.toLowerCase().includes(input.toLowerCase())
  })
}
