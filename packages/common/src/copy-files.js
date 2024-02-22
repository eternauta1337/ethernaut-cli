const fs = require('fs-extra');
const path = require('path');
const debug = require('common/src/debug');

module.exports = function copyFiles(src, dst) {
  debug.log(`>>> Copying files from ${src} to ${dst}`, 'common');

  if (!fs.existsSync(src)) {
    throw new Error(`Source directory ${src} does not exist`);
  }

  fs.ensureDirSync(dst);

  fs.readdirSync(src).forEach((file) => {
    fs.copySync(path.join(src, file), path.join(dst, file));
  });
};
