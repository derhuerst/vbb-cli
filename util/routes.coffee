#!/usr/bin/env coffee

Q =				require 'q'
inquirer =		require 'inquirer'
c256 =			require 'colors-256'
chalk =			require 'chalk'

vbb =			require 'vbb'
util =			require 'vbb-util'





query = (program) ->
	return program.client.routes
		from:		program.from
		to:			program.to
		results:	program.results
		products:	program.products





routeName = (route) ->
	start = route.parts[0].from.when
	stop = route.parts[route.parts.length - 1].to.when
	types = ''
	for part in route.parts
		if part.transport is 'public' then types += util.products[part.type].symbol
		else types += util.routes.legs.types[part.transport].symbol
		types += ' '
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
	deferred = Q.defer()
	choices = []
	for route, i in results
		start = route.parts[0].from.when
		stop = route.parts[route.parts.length - 1].to.when
		choices.push
			name: routeName route
			value:	route
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
