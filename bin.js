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
    --results   -r  The number of departures to show. Default: 8
    --products  -p  Allowed transportation types. Default: "all"
                    "all" = "suburban,subway,tram,bus,ferry,express,regional"
    --when      -w  A date & time string like "tomorrow 2 pm". Default: now
    --relative      Display date & time relatively.

`)
	process.exit(0)
}



if ('number' !== typeof opt.results)
	opt.results = parseInt(opt.results)

if ('all' === opt.products)
	opt.products = 'suburban,subway,tram,bus,ferry,express,regional'
opt.products = opt.products.split(/,\s?/g)



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
})

main(opt).catch(showError)
