const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');

// Paths
const src = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  'node_modules',
  'ethernaut'
);
const srcContracts = path.resolve(src, 'contracts', 'contracts');
const srcContractsLevels = path.resolve(srcContracts, 'levels');
const srcGamedata = path.resolve(src, 'client', 'src', 'gamedata');
const srcAbis = path.resolve(src, 'contracts', 'build', 'contracts');
const srcAbisLevels = path.resolve(srcAbis, 'levels');
const dst = path.resolve(__dirname, '..', 'extracted');
const dstContracts = path.resolve(dst, 'contracts');
const dstGamedata = path.resolve(dst, 'gamedata');
const dstAbis = path.resolve(dst, 'abis');

function isDir(p) {
  return fs.statSync(p).isDirectory();
}

function copyFiles(files, dest, modify) {
  fs.ensureDirSync(dest);

  for (const file of files) {
    const destFile = path.join(dest, path.basename(file));

    if (modify) {
      const content = fs.readFileSync(file, 'utf-8');
      const modifiedContent = modify(content);
      fs.writeFileSync(destFile, modifiedContent, 'utf-8');
    } else {
      fs.copySync(file, destFile);
    }
  }
}

async function runScript(scriptName, run = true) {
  console.log('> running', scriptName, run ? 'script' : '...');

  return new Promise((resolve, reject) => {
    const tokens = [];
    if (run) tokens.push('run');
    tokens.push(scriptName);
    tokens.push('--loglevel=info');

    const child = spawn('npm', tokens, {
      cwd: src,
    });

    child.stdout.on('data', (d) => console.log(`${d}`));
    child.stderr.on('data', (d) => console.error(`${d}`));
    child.on('close', (code) => {
      if (code !== 0) {
        reject(`child process exited with code ${code}`);
        return;
      }
      resolve();
    });
  });
}

function extractContracts() {
  const files = fs
    .readdirSync(srcContractsLevels) // Read all files in contracts/levels
    .filter((n) => !n.includes('Factory')) // Exclude level factories
    .map((n) => path.resolve(srcContractsLevels, n)) // Filenames to paths
    .filter((p) => !isDir(p)) // Exclude directories
    .concat([path.resolve(srcContracts, 'Ethernaut.sol')]); // Add Ethernaut.sol

  copyFiles(files, dstContracts);
}

function extractGamedata() {
  const files = fs
    .readdirSync(srcGamedata) // Read all files in gamedata
    .map((n) => path.resolve(srcGamedata, n)) // Filenames to paths
    .filter((p) => !isDir(p) || (isDir(p) && path.basename(p) === 'en')); // Exclude directories, except "en"

  copyFiles(files, dstGamedata);
}

async function extractAbis() {
  await runScript('install', false);
  await runScript('compile:contracts');

  function collectAbisInDir(dir) {
    let filesToReturn = [];

    const files = fs.readdirSync(dir);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(dir, file);
      if (isDir(filePath)) {
        const nestedFiles = collectAbisInDir(filePath);
        filesToReturn = filesToReturn.concat(nestedFiles);
      } else if (
        path.extname(file) === '.json' &&
        !file.includes('dbg') &&
        !file.includes('Factory')
      ) {
        filesToReturn.push(filePath);
      }
    }

    return filesToReturn;
  }

  const files = collectAbisInDir(srcAbisLevels).concat(
    collectAbisInDir(path.resolve(srcAbis, 'Ethernaut.sol'))
  );

  copyFiles(files, dstAbis, (content) => {
    const json = JSON.parse(content);
    return JSON.stringify(json.abi, null, 2);
  });
}

async function main() {
  console.log('Extracting Ethernaut CTF files...');
  extractContracts();
  extractGamedata();

  await extractAbis();
}
main();
