const fs = require('fs');
const path = require('path');

const soundDir = path.join(__dirname,'..', 'public', 'sounds');
const sounds = fs.readdirSync(soundDir).map((file) => {
  return file.split('.')[0];
});

//sounds.forEach((sound) => console.log(`Loaded ${sound}!`));

module.exports = sounds;
