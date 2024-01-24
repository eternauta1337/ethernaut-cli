const zmq = require('zeromq');

let sock;

async function init() {
  sock = new zmq.Push();
  await sock.bind('tcp://127.0.0.1:3000');
}

async function log(...msgs) {
  if (!sock) await init();

  const message = msgs.join(' ');

  try {
    await sock.send(message);
  } catch (err) {}
}

module.exports = {
  log,
};
