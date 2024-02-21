// The ethernaut dependecy's package file does not include
// a version, which makes library resolution during contract compilation fail (yes, this might be a bug in hardhat).
// So... we just add it :)

const fs = require('fs');
const path = require('path');

// Define the path to the package.json file
const packageJsonPath = path.join(
  __dirname,
  '../node_modules/ethernaut/package.json'
);

// Read the file
fs.readFile(packageJsonPath, 'utf8', function (err, data) {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Parse the JSON
  const packageJson = JSON.parse(data);

  // Add the version property
  packageJson.version = '1.0.0';

  // Stringify the JSON
  const updatedData = JSON.stringify(packageJson, null, 2);

  // Write the file
  fs.writeFile(packageJsonPath, updatedData, 'utf8', function (err) {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('Successfully updated package.json');
    }
  });
});
