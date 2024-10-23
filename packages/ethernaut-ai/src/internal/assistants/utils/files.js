const fs = require('fs')
const path = require('path')
const debug = require('ethernaut-common/src/ui/debug')

async function uploadFiles(openai, files) {
  // await _deleteAllFiles(openai)

  const uploadedFiles = await listFiles(openai)
  debug.log(`Uploaded files: ${JSON.stringify(uploadedFiles, null, 2)}`, 'ai')

  for (const file of files) {
    const filename = path.basename(file)

    if (isUploaded(uploadedFiles, filename)) {
      debug.log(`File ${file} already uploaded`, 'ai')
      continue
    }

    await _uploadFile(openai, file)
  }
}

function isUploaded(uploadedFiles, filename) {
  debug.log(`Checking if file ${filename} is uploaded`, 'ai')

  const uploaded = uploadedFiles.find((f) => f.filename === filename)

  if (!uploaded) return false

  if (uploaded.status !== 'processed') return false

  return true
}

async function listFiles(openai) {
  const response = await openai.files.list()
  return response.data
}

async function _uploadFile(openai, file) {
  debug.log(`Uploading file ${file}`, 'ai')

  const fileStream = fs.createReadStream(file)
  const response = await openai.files.create({
    file: fileStream,
    purpose: 'assistants',
  })
  debug.log(`Uploaded file ${JSON.stringify(response, null, 2)}`, 'ai')

  return response.id
}

async function _deleteAllFiles(openai) {
  const uploadedFiles = await listFiles(openai)
  for (const file of uploadedFiles) {
    await openai.files.del(file.id)
  }
}

module.exports = {
  uploadFiles,
  readFiles: listFiles,
}
