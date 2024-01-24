const zmq = require('zeromq');

async function listenToLogs() {
  const logger = new zmq.Pull();

  logger.connect('tcp://127.0.0.1:3000');
  console.log('Subscriber connected to port 3000');

  for await (const [msg] of logger) {
    console.log(msg.toString());
  }
}

listenToLogs().catch((err) => console.error('Error in subscriber:', err));
