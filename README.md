# win-exe [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> Windows setup builder and tooling

## Installation

```sh
$ npm install --save win-exe
```

## Usage

```js
const exe = require('win-exe');

exe({
  scripts: ['path/to/iss', 'other/path/to/iss'] // absolute or relative to cwd
});

// or when signing
exe({
  pfx: 'path/to/pfx' // absolute or relative to cwd
  name: 'signtool',
  scripts: ['path/to/iss', 'other/path/to/iss'] // absolute or relative to cwd
});
```
## License

 © [Glenn Vandeuren]()


[npm-image]: https://badge.fury.io/js/win-exe.svg
[npm-url]: https://npmjs.org/package/win-exe
[travis-image]: https://travis-ci.org/VandeurenGlenn/win-exe.svg?branch=master
[travis-url]: https://travis-ci.org/VandeurenGlenn/win-exe
[daviddm-image]: https://david-dm.org/VandeurenGlenn/win-exe.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/VandeurenGlenn/win-exe
[coveralls-image]: https://coveralls.io/repos/VandeurenGlenn/win-exe/badge.svg
[coveralls-url]: https://coveralls.io/r/VandeurenGlenn/win-exe
