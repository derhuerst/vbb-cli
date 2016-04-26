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
	  from:     native.to(argv._.shift())
	, to:       native.to(argv._.shift())
	, help:     native.to(argv.help     || argv.h)
	, results:  native.to(argv.results  || argv.r) || 4
	, products: native.to(argv.products || argv.p, ',') || 'all'
	, when:     native.to(argv.when     || argv.w) || null
}



if (opt.help === true) {
	process.stdout.write(`
vbb-route [from] [to] [options]

Arguments:
    from            Station number (e.g. 9023201) or query (e.g. "Zoo").
    to              Station number (e.g. 9023201) or query (e.g. "Zoo").

Options:
    --results   -r  The number of departures to show. Default: 3
    --products  -p  Allowed transportation types. Default: "all"
                    "all" = "suburban,subway,tram,bus,ferry,express,regional"
    --when      -w  A date & time string like "tomorrow 2 pm". Default: now

`)
	process.exit(0)
}



const showError = function (err) {
	process.stderr.write(chalk.red(err.message) + '\n')
	if (process.env.NODE_DEBUG === 'true') console.error(err.stack)
	process.exit(err.code || 1)
}

const main = so(function* (opt) {
	let from, to, when, results, products

	// query the station of departure
	if (!opt.from || opt.from === true)
		from = yield lib.queryStation('From where?')
	else from = opt.from
	try { from = (yield lib.parseStation(from))[0] }
	catch (err) { showError(err) }

	// query the destination
	if (!opt.to || opt.to === true)
		to = yield lib.queryStation('To where?')
	else to = opt.to
	try { to = (yield lib.parseStation(to))[0] }
	catch (err) { showError(err) }

	// query date & time
	if (opt.when === true) when = yield lib.queryWhen('When?')
	else if ('string' === typeof opt.when) when = lib.parseWhen(opt.when)
	else when = new Date()

	// nr of results
	if (opt.results === true) results = yield lib.queryResults('How many results?', 4)
	else results = lib.parseResults(opt.results, 4)

	// means of transport
	if (opt.products === true)
		products = yield lib.queryProducts('Which means of transport?')
	else products = lib.parseProducts(opt.products)

	const routes = yield lib.routes({from, to, when, results, products})
	let route
	if (routes.length === 1) route = routes[0]
	else route = yield lib.queryRoute('Which route?', routes)

	// render route
	process.stdout.write(render.routeDetails(route))

	process.stdin.unref() // todo: remove this hack
})

main(opt).catch(showError)
