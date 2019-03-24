#!/usr/bin/env node
const winExe = require('./win-exe');

const argv = process.argv;

const argVal = (arg, index = -1) => {
  index = argv.indexOf(arg);
  if (index !== -1) return argv[index + 1];
  return undefined;
}

const options = {};
options.pfx = argVal('pfx');
options.password = argVal('password');
options.scripts = argVal('scripts');
options.name = argVal('name'); // signtool name
if (options.scripts) options.scripts = options.scripts.split(',');
winExe(options)
