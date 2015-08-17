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





productSymbol = (type) ->
	# todo:
	# Since xterm does only support 0..5 for red, green and blue, we need to convert the rgb value here.
	# Find a cleaner solution, probably a dedicated module, for that.
	fg = hexRgb 'ffffff'   # todo: use a foreground that is readable on the background color
	fg[0] = Math.round fg[0] / 256 * 5
	fg[1] = Math.round fg[1] / 256 * 5
	fg[2] = Math.round fg[2] / 256 * 5
	bg = hexRgb util.products[type].color
	bg[0] = Math.round bg[0] / 256 * 5
	bg[1] = Math.round bg[1] / 256 * 5
	bg[2] = Math.round fg[2] / 256 * 5
	return [
		c256.fg.getRgb fg[0], fg[1], fg[2]
		c256.bg.getRgb bg[0], bg[1], bg[2]
		util.products[type].short
		c256.reset
	].join ''

routeName = (route) ->
	start = route.parts[0].from.when
	stop = route.parts[route.parts.length - 1].to.when

	types = ''
	for part in route.parts
		if part.transport is 'public' then types += productSymbol part.type
		else types += util.routes.legs.types[part.transport].symbol
		types += ' '   # fix weird unicode spacing error
	console.log types

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
