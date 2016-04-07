#!/usr/bin/env node
'use strict'

const yargs     = require('yargs')
const native    = require('cli-native')
const so        = require('so')
const chalk     = require('chalk')

const lib       = require('./index')
const render    = require('./render')



const argv = yargs.argv
const opt = {
	  station:  native.to(argv._.pop())
	, help:     native.to(argv.help     || argv.h)
	, results:  native.to(argv.results  || argv.r) || 8
	, products: native.to(argv.products || argv.p) || 'all'
	, when:     native.to(argv.when     || argv.w) || null
	, relative: native.to(argv.relative)
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
	let station, when, relative, results, products

	// query a station
	if (opt.station === true) station = yield lib.queryStation('Where?')
	try { station = (yield lib.parseStation(opt.station))[0] }
	catch (err) { showError(err) }

	// query date & time
	if (opt.when === true) when = yield lib.queryWhen('When?')
	else if ('string' === typeof opt.when) when = lib.parseWhen(opt.when)
	else when = new Date()
	relative = !!opt.relative

	// nr of results
	if (opt.results === true) results = yield lib.queryResults('How many results?')
	else results = lib.parseResults(opt.results)

	// means of transport
	if (opt.products === true)
		products = yield lib.queryProducts('Which means of transport?')
	else products = lib.parseProducts(opt.products)

	const departures = yield lib.fetch({station, when, relative, results, products})

	// render departures
	const table = render.table()
	for (let dep of departures) table.push([
		  render.product(dep.type)
		, render.time(dep.when)
		, render.station(dep.direction)
	])
	process.stdout.write(table.toString() + '\n')

	process.stdin.unref() // todo: remove this hack
})

main(opt).catch(showError)
