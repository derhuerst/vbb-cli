# vbb-cli

**A command line client for [Berlin & Brandenburg public transport (VBB)](https://en.wikipedia.org/wiki/Verkehrsverbund_Berlin-Brandenburg).**

[![asciicast](https://asciinema.org/a/42117.png)](https://asciinema.org/a/42117)

[![npm version](https://img.shields.io/npm/v/vbb-cli.svg)](https://www.npmjs.com/package/vbb-cli)
[![build status](https://img.shields.io/travis/derhuerst/vbb-cli.svg)](https://travis-ci.org/derhuerst/vbb-cli)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/vbb-cli.svg)
[![gitter channel](https://badges.gitter.im/derhuerst/vbb-rest.svg)](https://gitter.im/derhuerst/vbb-rest)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst)


## Installing

```shell
npm install -g vbb-cli
```

Or just run it using [`npx`](https://npmjs.com/npx).


## Usage

```
vbb-dep [station] [options]

Arguments:
    station         Station number (like "900000023201") or search string (like "Zoo").

Options:
    --location  -l  Use current location. OS X only.
    --duration  -d  Show departures for the next n minutes. Default: 15
    --when      -w  A date & time string like "tomorrow 2 pm". Default: now
```

```
vbb-route [from] [to] [options]

Arguments:
    from            Station number (e.g. 900000023201) or query (e.g. "Zoo").
    to              Station number (e.g. 900000023201) or query (e.g. "Zoo").

Options:
    --results   -r  The number of departures to show. Default: 3
    --products  -p  Allowed transportation types. Default: "all"
                    "all" = "suburban,subway,tram,bus,ferry,express,regional"
    --when      -w  A date & time string like "tomorrow 2 pm". Default: now
```


## Contributing

If you have a question or have difficulties using `vbb-cli`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/vbb-cli/issues).
