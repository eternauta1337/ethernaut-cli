const fs = require('fs-extra');
const path = require('path');

const src = path.join(__dirname, '../extracted/abis');
const dst = path.join(__dirname, '../../ethernaut-cli/artifacts/interact/abis');

module.exports = function injectAbis() {
  const files = fs.readdirSync(src);

  files.forEach((file) => {
    if (path.extname(file) === '.json') {
      fs.copySync(path.join(src, file), path.join(dst, file));
    }
  });
};
