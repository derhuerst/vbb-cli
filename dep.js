#!/usr/bin/env node
'use strict'

const mri = require('mri')
const chalk = require('chalk')
const createDeparturesCli = require('hafas-cli/departures')

const pkg = require('./package.json')
const hafas = require('./lib/hafas')
const productColor = require('./lib/product-color')
const productSymbol = require('./lib/product-symbol')
const lineColor = require('./lib/line-color')

const argv = mri(process.argv.slice(2), {
	boolean: [
		'help', 'h',
		'version', 'v',
		'location', 'l',
		'show-ids'
	]
})

if (argv.help || argv.h) {
	process.stdout.write(`
vbb-dep [station] [options]

Arguments:
    station         Station number (like "900000023201") or search string (like "Zoo").

Options:
    --location  -l  Use current location. OS X only.
    --duration  -d  Show departures for the next n minutes. Default: 15
    --when      -w  A date & time string like "tomorrow 2 pm". Default: now
    --products  -p  Allowed transportation types.
                    Default: suburban,subway,tram,bus,ferry,express,regional
    --show-ids      Show station & journey leg IDs. Default: false

`)
	process.exit(0)
}

if (argv.version || argv.v) {
	process.stdout.write(`vbb-dep v${pkg.version}\n`)
	process.exit(0)
}

const showError = function (err) {
	if (process.env.NODE_DEBUG === 'vbb-cli') console.error(err)
	else process.stderr.write(chalk.red(err.message || (err + '')) + '\n')
	process.exit(err.code || 1)
}

const departuresCli = createDeparturesCli(hafas, {
	productColor, productSymbol,
	lineColor,
	showLocationIds: argv['show-ids'], showTripIds: argv['show-ids']
})
departuresCli({
	station: argv._[0],
	useCurrentLocation: argv.location || argv.l,
	duration: argv.duration || argv.d,
	queryDuration: (argv.duration || argv.d) === true,
	when: argv.when || argv.w,
	queryWhen: (argv.when || argv.w) === true,
	products: argv.products || argv.p,
	queryProducts: (argv.products || argv.p) === true
})
.catch(showError)
