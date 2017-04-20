const fs = require('fs');
const path = require('path');
let cache;

function checkDirectory(directoryPath) {
  try {
    fs.statSync(directoryPath);
    return true;
  }
  catch(err) {
    return false;
  }
}

function getDirectoryContents(directory) {
  console.log(directory);
  directory = directory ? directory : 'default';
  const directoryPath = path.join(__dirname,'..', 'public', 'sounds', directory);
  if (checkDirectory(directoryPath) == false) {
    return [];
  }
  const files = fs.readdirSync(directoryPath).map((file) => {
    return {
      name: file.split('.')[0],
      directory: directory
    };
  });
  return files;
}

function getLibrary() {
  const lib = fs.readdirSync(path.join(__dirname,'..', 'public', 'sounds'));
  const results = lib.map(getDirectoryContents).reduce((a, b) => { return a.concat(b) });
  return results;
}

module.exports = () => {
  if (cache) return cache;
  cache = getLibrary();
  return cache;
};