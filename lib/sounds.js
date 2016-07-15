const fs = require('fs');
const path = require('path');
var cache = {};

function checkDirectory(directoryPath) {
  try {
    fs.statSync(directoryPath);
    return true;
  }
  catch(err) {
    return false;
  }
}

function getDirectory(directory) {
  directory = directory ? directory : 'default';
  directoryPath = path.join(__dirname,'..', 'public', 'sounds', directory);
  if (checkDirectory(directoryPath) == false) {
    return [];
  }
  files = fs.readdirSync(directoryPath).map((file) => {
    return {
      name: file.split('.')[0],
      directory: directory
    };
  });
  return files;
}

function getLibrary() {
  var lib = fs.readdirSync(path.join(__dirname,'..', 'public', 'sounds'));
  var results = lib.map((dir) => {
    return getDirectory(dir);
  });
  results = results.reduce((a, b) => {
    return a.concat(b);
  });
  return results;
}

module.exports = (addon) => {
  if (cache[addon]) return cache[addon];

  //used to generate routes for every sound
  if (addon == 'all') return getLibrary();

  //used to give access to sounds based on addon parameter
  var sounds = getDirectory();
  if (addon) {
    var addonSounds = getDirectory(addon);
    sounds = sounds.concat(addonSounds);
  }

  cache[addon] = sounds;
  return sounds;
};