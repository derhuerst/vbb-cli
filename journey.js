#!/usr/bin/env node
'use strict'

const mri = require('mri')
const chalk = require('chalk')
const createJourneysCli = require('hafas-cli/journeys')

const pkg = require('./package.json')
const hafas = require('./lib/hafas')
const productColor = require('./lib/product-color')
const productSymbol = require('./lib/product-symbol')
const lineColor = require('./lib/line-color')

const argv = mri(process.argv.slice(2), {
	boolean: ['help', 'h', 'version', 'v', 'location', 'l']
})

if (argv.help || argv.h) {
	process.stdout.write(`
vbb-journey [origin] [destination] [options]

Arguments:
    origin          Station number (e.g. 900000023201) or query (e.g. "Zoo").
    destination     Station number (e.g. 900000023201) or query (e.g. "Zoo").

Options:
    --results   -r  The number of journeys to show. Default: 4
    --products  -p  Allowed transportation types. Default: "all"
                    "all" = "suburban,subway,tram,bus,ferry,express,regional"
    --when      -w  A date & time string like "tomorrow 2 pm". Default: now

`)
	process.exit(0)
}

if (argv.version || argv.v) {
	process.stdout.write(`vbb-journey v${pkg.version}\n`)
	process.exit(0)
}

const showError = function (err) {
	if (process.env.NODE_DEBUG === 'vbb-cli') console.error(err)
	else process.stderr.write(chalk.red(err.message || (err + '')) + '\n')
	process.exit(err.code || 1)
}

const departuresCli = createJourneysCli(hafas, {
	productColor, productSymbol,
	lineColor
})
departuresCli({
	origin: argv._[0],
	destination: argv._[1],
	results: argv.results || argv.r || 4,
	queryResults: (argv.results || argv.r) === true,
	when: argv.when || argv.w,
	queryWhen: (argv.when || argv.w) === true,
	products: argv.products || argv.p,
	queryProducts: (argv.products || argv.p) === true
})
.catch(showError)
