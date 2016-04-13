# vbb-cli

**Easily the most awesome public transport CLI on the planet.**

[![asciicast](https://asciinema.org/a/42117.png)](https://asciinema.org/a/42117)

*vbb-cli* is a command line client for the **Berlin & Brandenburg public transport (VBB) API**.

[![npm version](https://img.shields.io/npm/v/vbb-cli.svg)](https://www.npmjs.com/package/vbb-cli)
[![build status](https://img.shields.io/travis/derhuerst/vbb-cli.svg)](https://travis-ci.org/derhuerst/vbb-cli)
[![dependency status](https://img.shields.io/david/derhuerst/vbb-cli.svg)](https://david-dm.org/derhuerst/vbb-cli)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/vbb-cli.svg)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/vbb-cli.svg)


## Installing

```shell
npm install -g vbb-cli
```


## Usage

```
vbb-dep [station] [options]

Arguments:
    station         Station number (like "9023201") or search string (like "Zoo").

Options:
    --results   -r  The number of departures to show. Default: 3
    --products  -p  Allowed transportation types. Default: "all"
                    "all" = "suburban,subway,tram,bus,ferry,express,regional"
    --when      -w  A date & time string like "tomorrow 2 pm". Default: now
```

```
vbb-route [from] [to] [options]

Arguments:
    from            Station number (e.g. 9023201) or query (e.g. "Zoo").
    to              Station number (e.g. 9023201) or query (e.g. "Zoo").

Options:
    --results   -r  The number of departures to show. Default: 3
    --products  -p  Allowed transportation types. Default: "all"
                    "all" = "suburban,subway,tram,bus,ferry,express,regional"
    --when      -w  A date & time string like "tomorrow 2 pm". Default: now
```


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/vbb-cli/issues).
