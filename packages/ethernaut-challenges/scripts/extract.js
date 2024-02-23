const fs = require('fs-extra')
const path = require('path')

// Paths
const srcAbis = path.resolve(__dirname, '..', 'artifacts', 'contracts')
const srcAbisLevels = path.resolve(srcAbis, 'levels')
const dst = path.resolve(__dirname, '..')
const dstAbis = path.resolve(dst, 'abis')

function isDir(p) {
  return fs.statSync(p).isDirectory()
}

function copyFiles(files, dest, modify) {
  console.log('Copying files', files, 'to', dest)
  fs.ensureDirSync(dest)

  for (const file of files) {
    const destFile = path.join(dest, path.basename(file))

    if (modify) {
      const content = fs.readFileSync(file, 'utf-8')
      const modifiedContent = modify(content)
      fs.writeFileSync(destFile, modifiedContent, 'utf-8')
    } else {
      fs.copySync(file, destFile)
    }
  }
}

async function extractAbis() {
  function collectAbisInDir(dir) {
    let filesToReturn = []

    const files = fs.readdirSync(dir)
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const filePath = path.join(dir, file)
      if (isDir(filePath)) {
        const nestedFiles = collectAbisInDir(filePath)
        filesToReturn = filesToReturn.concat(nestedFiles)
      } else if (
        path.extname(file) === '.json' &&
        !file.includes('dbg') &&
        !file.includes('Factory')
      ) {
        filesToReturn.push(filePath)
      }
    }

    return filesToReturn
  }

  const files = collectAbisInDir(srcAbisLevels).concat(
    collectAbisInDir(path.resolve(srcAbis, 'Ethernaut.sol')),
  )

  copyFiles(files, dstAbis, (content) => {
    const json = JSON.parse(content)
    return JSON.stringify(json.abi, null, 2)
  })
}

async function main() {
  await extractAbis()
}
main()
