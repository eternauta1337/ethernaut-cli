const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

const storageFilePath = path.join(__dirname, '../../storage/', 'storage.json');

let storage;

const schema = {
  config: {
    provider: {
      list: [],
      current: undefined,
    },
  },
  addresses: {
    sepolia: {},
  },
};

// Create the file if it doesn't exist
if (!fs.existsSync(storageFilePath)) {
  fs.writeFileSync(storageFilePath, JSON.stringify(schema, null, 2));
}

// Load the file
const fileContent = fs.readFileSync(storageFilePath, 'utf8');
storage = JSON.parse(fileContent);

const emitter = new EventEmitter();

// Wrap the storage object in a Proxy,
// so that changes are persisted to disk whenever a change occurs

// This handler will be called whenever a property is accessed
const proxyHandler = {
  get(target, property) {
    // If a property that doesn't exist is accessed,
    // check if the schema has it, and if so create it.
    if (!target.hasOwnProperty(property) && schema.hasOwnProperty(property)) {
      target[property] = schema[property];
      this.saveToDisk();
    }

    return target[property];
  },

  set(target, property, value) {
    target[property] = value;
    this.saveToDisk();

    emitter.emit('propertySet', { target, property, value });

    return true;
  },

  saveToDisk() {
    fs.writeFileSync(storageFilePath, JSON.stringify(storage, null, 2));
  },
};

// The handler is actually recursively applied to all the properties
// of the storage object that are also an object
function createDeepProxy(obj, handler) {
  for (let prop in obj) {
    if (typeof obj[prop] === 'object' && obj[prop] !== null) {
      obj[prop] = createDeepProxy(obj[prop], handler);
    }
  }
  return new Proxy(obj, handler);
}

const storageProxy = createDeepProxy(storage, proxyHandler);

function onStorageChange(property, callback) {
  emitter.on('propertySet', ({ target }) => {
    if (JSON.stringify(property) === JSON.stringify(target)) {
      callback();
    }
  });
}

module.exports = {
  storage: storageProxy,
  onStorageChange,
};
