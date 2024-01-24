const readline = require('readline');
const zmq = require('zeromq');

let logger;

async function main() {
  await initLogger();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  rl.setPrompt('> ');

  rl.input.on('keypress', async () => {
    await log('keypress');
  });

  rl.prompt();
}

async function initLogger() {
  logger = new zmq.Push();
  await logger.bind('tcp://127.0.0.1:3000');
}

async function log(...msgs) {
  const message = msgs.join(' ');
  await logger.send(message);
}

main();
