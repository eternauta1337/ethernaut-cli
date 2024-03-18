const fs = require('fs')
const path = require('path')
const os = require('os')
const prompt = require('./prompt')

module.exports = async function browse() {
  return browseAt(os.homedir())
}

async function browseAt(location) {
  let choices = listFilesAt(location).map((p) => {
    const fullPath = path.resolve(location, p)
    const dir = isDir(fullPath)
    const reducedPath = fullPath.replace(os.homedir(), '~')
    return {
      title: dir ? `${reducedPath}/` : reducedPath,
      value: fullPath,
    }
  })

  choices.unshift({
    title: '..',
    value: path.resolve(location, '..'),
  })

  const response = await prompt({
    type: 'autocomplete',
    message: 'Select a file or directory',
    choices,
  })

  const nextLocation = path.resolve(location, response)

  if (isDir(nextLocation)) {
    return browseAt(nextLocation)
  } else {
    return nextLocation
  }
}

function isDir(path) {
  return fs.statSync(path).isDirectory()
}

function listFilesAt(path) {
  return fs.readdirSync(path).filter((p) => !p.startsWith('.'))
}
