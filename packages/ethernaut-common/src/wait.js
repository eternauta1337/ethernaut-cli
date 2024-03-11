module.exports = async function wait(delay) {
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, delay)
  })
}
