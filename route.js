#!/usr/bin/env node
'use strict'

const mri = require('mri')
const native    = require('cli-native')
const so        = require('so')
const chalk     = require('chalk')

const pkg = require('./package.json')
const lib       = require('./index')
const render    = require('./render')



const argv = mri(process.argv.slice(2), {
	boolean: ['help', 'h', 'version', 'v']
})
const opt = {
	  from:     argv._[0]
	, to:       argv._[1]
	, help:     argv.help     || argv.h
	, version:  argv.version  || argv.v
	, results:  argv.results  || argv.r || 4
	, products: native.to(argv.products || argv.p, ',') || 'all'
	, when:     argv.when     || argv.w || null
}



if (opt.help === true) {
	process.stdout.write(`
vbb-route [from] [to] [options]

Arguments:
    from            Station number (e.g. 900000023201) or query (e.g. "Zoo").
    to              Station number (e.g. 900000023201) or query (e.g. "Zoo").

Options:
    --results   -r  The number of departures to show. Default: 3
    --products  -p  Allowed transportation types. Default: "all"
                    "all" = "suburban,subway,tram,bus,ferry,express,regional"
    --when      -w  A date & time string like "tomorrow 2 pm". Default: now

`)
	process.exit(0)
}

if (opt.version === true) {
	process.stdout.write(`vbb-route v${pkg.version}\n`)
	process.exit(0)
}



const showError = function (err) {
	if (process.env.NODE_DEBUG === 'vbb-cli') console.error(err)
	process.stderr.write(chalk.red(err.message) + '\n')
	process.exit(err.code || 1)
}

const main = so(function* (opt) {
	let from, to, when, results, products

	// query the station of departure
	if (!opt.from || opt.from === true) {
		from = yield lib.queryStation('From where?')
	} else from = opt.from
	try {
		from = yield lib.parseStation(from)
	} catch (err) {
		showError(err)
	}

	// query the destination
	if (!opt.to || opt.to === true) {
		to = yield lib.queryStation('To where?')
	} else to = opt.to
	try {
		to = (yield lib.parseStation(to))
	} catch (err) {
		showError(err)
	}

	// query date & time
	if (opt.when === true) when = yield lib.queryWhen('When?')
	else if ('string' === typeof opt.when) when = lib.parseWhen(opt.when)
	else when = new Date()

	// nr of results
	if (opt.results === true) {
		results = yield lib.queryResults('How many results?', 4)
	} else results = lib.parseResults(opt.results, 4)

	// means of transport
	if (opt.products === true) {
		products = yield lib.queryProducts('Which means of transport?')
	} else products = lib.parseProducts(opt.products)

	const journeys = yield lib.journeys({from, to, when, results, products})
	let journey
	if (journeys.length === 1) journey = journeys[0]
	else journey = yield lib.queryJourney('Which route?', journeys)

	// render journey
	process.stdout.write(render.journeyDetails(journey))
})

main(opt).catch(showError)
