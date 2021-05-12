# vbb-cli

**A command line client for [Berlin & Brandenburg public transport (VBB)](https://en.wikipedia.org/wiki/Verkehrsverbund_Berlin-Brandenburg).** Built on top of [`vbb-hafas`](https://github.com/public-transport/vbb-hafas).

[![asciicast](https://asciinema.org/a/239395.png)](https://asciinema.org/a/239395)

[![npm version](https://img.shields.io/npm/v/vbb-cli.svg)](https://www.npmjs.com/package/vbb-cli)
[![build status](https://img.shields.io/travis/derhuerst/vbb-cli.svg)](https://travis-ci.org/derhuerst/vbb-cli)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/vbb-cli.svg)
[![support me via GitHub Sponsors](https://img.shields.io/badge/support%20me-donate-fa7664.svg)](https://github.com/sponsors/derhuerst)
[![chat with me on Twitter](https://img.shields.io/badge/chat%20with%20me-on%20Twitter-1da1f2.svg)](https://twitter.com/derhuerst)


## Installing

```shell
npm install -g vbb-cli
```

Or just run it using [`npx`](https://npmjs.com/npx).


## Usage

```
vbb-dep [station] [options]

Arguments:
    station         Station number (like 900000023201) or search string (like "Zoo").

Options:
    --location  -l  Use current location. macOS only.
    --duration  -d  Show departures for the next n minutes. Default: 15
    --when      -w  A date & time string like "tomorrow 2 pm". Default: now
    --products  -p  Allowed transportation types.
                    Default: suburban,subway,tram,bus,ferry,express,regional
    --show-ids      Show station & journey leg IDs. Default: false
```

```
vbb-journey [origin] [destination] [options]

Arguments:
    origin          Station number (e.g. 900000023201) or query (e.g. "Zoo").
    destination     Station number (e.g. 900000023201) or query (e.g. "Zoo").

Options:
    --results   -r  The number of journeys to show. Default: 4
    --products  -p  Allowed transportation types. Default: "all"
                    "all" = "suburban,subway,tram,bus,ferry,express,regional"
    --when      -w  A date & time string like "tomorrow 2 pm". Default: now
    --show-ids      Show station & journey leg IDs. Default: false
```


## Contributing

If you have a question or have difficulties using `vbb-cli`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/vbb-cli/issues).
