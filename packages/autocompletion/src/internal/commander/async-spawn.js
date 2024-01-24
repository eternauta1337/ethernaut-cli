const { spawn } = require('child_process');

async function asyncSpawn(args) {
  return new Promise((resolve, reject) => {
    const child = spawn('program', [...args]);

    child.stdout.on('data', (data) => {
      console.log(`>>> ${data.toString()}`);
    });

    child.stderr.on('data', (data) => {
      reject(`>>> ${data.toString()}`);
    });

    child.on('exit', () => {
      resolve();
    });
  });
}

module.exports = {
  asyncSpawn,
};
