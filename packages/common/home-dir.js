const os = require('os');

module.exports = function replaceHomeDir(pathString) {
  const homeDir = os.homedir();
  if (pathString.startsWith(homeDir)) {
    return pathString.replace(homeDir, '~');
  }
  return pathString;
};
