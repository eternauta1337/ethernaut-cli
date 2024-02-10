const fs = require('fs-extra');
const path = require('path');

module.exports = function copyFiles(src, dst) {
  src = path.join(__dirname, '..', src);
  dst = path.join(__dirname, '..', dst);

  fs.ensureDirSync(dst);

  fs.readdirSync(src).forEach((file) => {
    fs.copySync(path.join(src, file), path.join(dst, file));
  });
};
