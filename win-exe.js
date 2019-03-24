const { spawn } = require('child_process');
const { join, resolve, isAbsolute } = require('path');
const { readFile } = require('fs');
const ora = require('ora');

const cwd = process.cwd();
const cmdLine = join(__dirname, 'bin', 'ISCC.exe');
let _package;

let spinner;


const log = (text, type = false) => {
  if (type) return spinner[type](text);
  if (spinner) spinner.text = text;
  else spinner = ora(text).start();
}

const getPackage = () => new Promise((resolve, reject) => {
  if (_package) return resolve(_package);

  readFile(join(process.cwd(), 'package.json'), (error, data) => {
    if (error) return reject(error);
    data = JSON.parse(data.toString());
    _package = data;
    resolve(data);
  })
});

const getPackageOptions = async () => {
  const { winExe } = await getPackage();
  if (winExe) return winExe;
  return false
};

const getPackageName = async () => {
  const pack = await getPackage();
  return pack.name;
}

const child = (args, verbose = false) => new Promise((resolve, reject) => {
  const child = spawn(cmdLine, args)
  child.stdout.on('data', data => {
    data = data.toString();
    data = data.replace('\n', ' ')
    if (verbose) console.log(data);
    else log(data)
  })

  child.stderr.on('data', data => verbose ? log(data.toString()) : null)

  child.on('close', code => {
    if (code === 0) verbose ? resolve(log(code)) : resolve(log(''));
    else reject(code)
  })
});
const validateOrTransformOptions = async options => {
  const packageOptions = await getPackageOptions();
  if (!options || options && options.password && packageOptions) {
    packageOptions.password = options.password;
    options = packageOptions;
  }
  const { name, password, pfx, scripts } = options;
  if (pfx && !password) throw 'a pfx filename is passed, expected password to be defined';
  if (pfx && !scripts) {
    const packageName = await getPackageName();
    const path = join(cwd, `${packageName}.iss`)
    console.warn(`no inno setup script path defined, defaulting to '${path}'`);
    options.scripts = [path];
  }
  if (pfx && !name) {
    console.warn(`no signtool name set, defaulting to 'signtool'`);
    options.name = 'signtool';
  }
  if (!pfx && options.scripts && options.name) {
    const packageName = await getPackageName();
    const path = join(cwd, `${packageName}`);
    console.warn(`no pfx file name set, defaulting to '${path}'`);
    options.pfx = path;
  }
  return options;
}
module.exports = async options => {
  log('build setup');
  try {
    options = await validateOrTransformOptions(options);
    if (!Array.isArray(options.scripts)) options.scripts = [options.scripts];
    for (const path of options.scripts) {
      const args = isAbsolute(path) ? [path] : [join(cwd, path)];
      if (options.name && options.pfx) {
        const signtool = join(__dirname, 'bin', 'signtool.exe');
        options.pfx = isAbsolute(options.pfx) ? options.pfx : join(cwd, options.pfx);

        args.push(`/S${options.name}=${signtool} sign /f ${options.pfx} /t http://timestamp.globalsign.com/scripts/timstamp.dll /p ${options.password} $f`)
      }

      await child(args, options.verbose);
      log('build setup', 'succeed');
    }
  } catch (e) {
    log('build setup', 'fail');
    console.error(e);
  }
}
