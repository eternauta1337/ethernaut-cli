const fs = require('fs');
const path = require('path');

const storageFilePath = path.join(__dirname, '../../', 'storage.json');

let storage;

// Load storage from file
if (fs.existsSync(storageFilePath)) {
  const fileContent = fs.readFileSync(storageFilePath, 'utf8');
  storage = JSON.parse(fileContent);
}

// Create a recursive function to apply the Proxy to all nested objects
function createDeepProxy(obj, handler) {
  for (let prop in obj) {
    if (typeof obj[prop] === 'object' && obj[prop] !== null) {
      obj[prop] = createDeepProxy(obj[prop], handler);
    }
  }
  return new Proxy(obj, handler);
}

// Create a proxy to handle changes to the object
// Writes to disk when a change occurs
const handler = {
  set(target, property, value) {
    target[property] = value;
    fs.writeFileSync(storageFilePath, JSON.stringify(storage, null, 2));
    return true;
  },
};
const proxyStorage = createDeepProxy(storage, handler);

// Prevent extensions
// Object.preventExtensions(proxyStorage);

module.exports = proxyStorage;
