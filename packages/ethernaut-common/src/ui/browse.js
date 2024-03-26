const fs = require('fs')
const path = require('path')
const os = require('os')
const { prompt } = require('./prompt')

let _prompt

async function browse(hidden = false) {
  return browseAt(os.homedir(), hidden)
}

async function browseAt(location, hidden = false) {
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
    show: !hidden,
    onPrompt: (p) => (_prompt = p),
  })

  const nextLocation = path.resolve(location, response)

  if (isDir(nextLocation)) {
    return browseAt(nextLocation, hidden)
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

function getPrompt() {
  return _prompt
}

module.exports = {
  browse,
  browseAt,
  getPrompt,
}
