#!/usr/bin/env node
'use strict'

const yargs     = require('yargs')
const native    = require('cli-native')
const so        = require('so')
const chalk     = require('chalk')
const locate    = require('location')

const lib       = require('./index')
const render    = require('./render')



const argv = yargs.argv
const opt = {
	  station:  native.to(argv._.shift())
	, help:     native.to(argv.help     || argv.h)
	, location: native.to(argv.location || argv.l)
	, duration: native.to(argv.duration || argv.d) || 15
	, when:     native.to(argv.when     || argv.w) || null
}



if (opt.help === true) {
	process.stdout.write(`
vbb-dep [station] [options]

Arguments:
    station         Station number (like "9023201") or search string (like "Zoo").

Options:
    --location  -l  Use current location. OS X only.
    --duration  -d  Show departures for the next n minutes. Default: 15
    --when      -w  A date & time string like "tomorrow 2 pm". Default: now

`)
	process.exit(0)
}



const showError = function (err) {
	if (process.env.NODE_DEBUG === 'vbb-cli') console.error(err)
	process.stderr.write(chalk.red(err.message) + '\n')
	if (process.env.NODE_DEBUG === 'true') console.error(err.stack)
	process.exit(err.code || 1)
}

const main = so(function* (opt) {
	let station, when, duration, products

	if (opt.location === true) {
		try {station = yield lib.queryCloseStations('Where?', yield locate())}
		catch (err) { showError(err) }
	} else if (!opt.station || opt.station === true)
		station = yield lib.queryStation('Where?')
	else station = opt.station
	try { station = (yield lib.parseStation(station)) }
	catch (err) { showError(err) }

	// query date & time
	if (opt.when === true) when = yield lib.queryWhen('When?')
	else if ('string' === typeof opt.when) when = lib.parseWhen(opt.when)
	else when = new Date()

	// duration
	if (opt.duration === true) duration = yield lib.queryDuration('Show departures for how many minutes?', 15)
	else duration = lib.parseDuration(opt.duration, 15)

	// means of transport
	if (opt.products === true)
		products = yield lib.queryProducts('Which means of transport?')
	else products = lib.parseProducts(opt.products)

	const departures = yield lib.departures({station, when, duration, products})

	// render departures
	if (departures.length === 0)
		process.stdout.write(chalk.red('No departures.'))

	const table = render.table()
	for (let dep of departures) table.push([
		  render.product(dep.product.type)
		, render.line(dep.product)
		, render.when(dep.when)
		, render.station(dep.direction)
	])
	process.stdout.write(table.toString() + '\n')

	process.stdin.unref() // todo: remove this hack
})

main(opt).catch(showError)
