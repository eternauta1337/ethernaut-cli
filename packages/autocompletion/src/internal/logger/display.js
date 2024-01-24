const zmq = require('zeromq');

async function displayLogs() {
  const sock = new zmq.Pull();

  sock.connect('tcp://127.0.0.1:3000');

  for await (const [msg] of sock) {
    console.log(msg.toString());
  }
}

displayLogs().catch((err) => console.error('Display error:', err.message));
