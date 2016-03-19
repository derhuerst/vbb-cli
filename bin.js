#!/usr/bin/env node
'use strict'

const yargs     = require('yargs')
const parseTime = require('parse-messy-time')
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

if ('string' === typeof opt.when)
	opt.when = parseTime(opt.when)
else opt.when = new Date()



const main = so(function* (opt) {
	try { station = yield lib.parseStation(opt.station) }
	catch (err) { process.stderr.write(err.message) }
})

main(opt)
