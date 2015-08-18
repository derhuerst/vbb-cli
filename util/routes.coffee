#!/usr/bin/env coffee

Q =				require 'q'
inquirer =		require 'inquirer'
c256 =			require 'ansi-256-colors'
hexRgb =		require 'hex-rgb'
chalk =			require 'chalk'
Duration =		require 'duration-js'

vbb =			require 'vbb'
util =			require 'vbb-util'





query = (program) ->
	return program.client.routes
		from:		program.from
		to:			program.to
		results:	program.results
		products:	program.products




firstToUpperCase = (string) -> string.substr(0, 1).toUpperCase() + string.substr 1

productColor = (product, text) ->
	product = util.products[product] or util.products.unknown
	styles = chalk
	for style in product.ansi
		if styles[style]
			styles = styles[style]
	return styles text

productSymbol = (part) ->
	if part.transport is 'public'
		product = util.products[part.type] or util.products.unknown
		productColor part.type, product.short
	else return util.routes.legs.types[part.transport].unicode + ' '

partSymbol = (part) ->
	if part.transport is 'public'
		product = util.products[part.type] or util.products.unknown
		return productColor part.type, product.name + ' ' + part.line
	else return util.routes.legs.types[part.transport].unicode + ' '





routeName = (route) ->
	first = route.parts[0].from
	last = route.parts[route.parts.length - 1].to

	types = []
	for part in route.parts
		types.push productSymbol part
	types = types.join ' '

	return [
		[
			('0' + start.getHours()).slice -2
			('0' + start.getMinutes()).slice -2
		].join ':'
		'–'
		[
			('0' + stop.getHours()).slice -2
			('0' + stop.getMinutes()).slice -2
		].join ':'
		chalk.yellow new Duration(stop - start).toString()
		types
	].join ' '



routes = (results) ->
	choices = []
	for result in results
		choices.push
			name:	routeName result
			value:	result

	deferred = Q.defer()
	inquirer.prompt [{
		type:		'list',
		name:		'route',
		message:	'What suits best?',
		choices:	choices
	}], (answers) ->
		deferred.resolve answers.route
	return deferred.promise





module.exports = (program) ->
	return query program
	.then routes
