# vbb-cli

**Easily the most awesome public transport CLI on the planet.**

[![vbb-cli 0.2.0](https://asciinema.org/a/25199.png)](https://asciinema.org/a/25199)

*vbb-cli* is a command line client for the **Berlin & Brandenburg public transport (VBB) API**. It written in CoffeeScript and uses the [`vbb` API client library](https://github.com/derhuerst/vbb).

[![npm version](https://img.shields.io/npm/v/vbb-cli.svg)](https://www.npmjs.com/package/vbb-cli)
[![dependency status](https://img.shields.io/david/derhuerst/vbb-cli.svg)](https://david-dm.org/derhuerst/vbb-cli)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/vbb-cli.svg)



## Installing


### globally

This is the recommended way.

```shell
npm install -g vbb-cli
```


### locally

You can also try out *vbb-cli* without polluting your global module space.

```shell
npm install vbb-cli
ln -s node_modules/.bin/vbb ./vbb
```

You have to use `./vbb` instead of `vbb` now.



## Usage

```
  Usage: vbb [options]

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -f, --from [station]   Where the routes shall begin.
    -t, --to [station]     Where the routes shall end.
    -r, --results [n]      The number of routes.
    -p, --products [list]  Allowed transportation types.
```

If you don't pass the options, *vbb-cli* will ask for them interactively.



## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/vbb-cli/issues).
