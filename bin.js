#!/usr/bin/env node
'use strict'

const yargs     = require('yargs')
const so        = require('so')

const lib       = require('./index')



const argv = yargs.argv
const opt = {
	station:  argv._.pop(),
	help:     argv.help     || argv.h,
	results:  argv.results  || argv.r || 8,
	products: argv.products || argv.p || 'all',
	when:     argv.when     || argv.w || null,
	relative: argv.relative
}



if (opt.help === true) {
	process.stdout.write(`
vbb [station] [options]

Arguments:
    station         Station number (like "9023201") or search string (like "Zoo").

Options:
    --results   -r  The number of departures to show. Default: 3
    --products  -p  Allowed transportation types. Default: "all"
                    "all" = "suburban,subway,tram,bus,ferry,express,regional"
    --when      -w  A date & time string like "tomorrow 2 pm". Default: now
    --relative      Display date & time relatively.

`)
	process.exit(0)
}



const showError = function (err) {
	console.error(err.stack)
	process.exit(err.code || 1)
}

const main = so(function* (opt) {

	// query a station
	if (!opt.station)
		opt.station = yield lib.queryStation('Where?')
	try { opt.station = yield lib.parseStation(opt.station) }
	catch (err) { showError(err) }
	console.log('opt.station', opt.station.name, opt.station.id)

	// query date & time
	if (opt.when) opt.when = lib.parseWhen(opt.when)
	else opt.when = yield lib.queryWhen('When?')
	console.log('opt.when', opt.when.toString())

	// nr of results
	if (opt.results === true)
		opt.results = yield lib.queryResults('How many results?')
	else opt.results = lib.parseResults(opt.results)

	// means of transport
	if (opt.products === true)
		opt.products = yield lib.queryProducts('Which means of transport?')
	else opt.products = lib.parseProducts(opt.products)

	process.stdin.unref() // todo: remove this hack
})

main(opt).catch(showError)
