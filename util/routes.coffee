#!/usr/bin/env coffee

Q =				require 'q'
inquirer =		require 'inquirer'
chalk =			require 'chalk'
moment =		require 'moment'

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
			renderTime first.when
			renderTime last.when
		].join chalk.gray '-'
		renderDuration first.when, last.when
		types
	].join '  '





renderDate = (timestamp) ->
	return chalk.cyan moment.unix(timestamp).format 'MMM D'

renderTime = (timestamp) ->
	return chalk.cyan moment.unix(timestamp).format 'HH:mm'

renderDuration = (start, stop) ->
	if stop? then m = moment.duration stop - start
	else m = moment.duration start
	result = []
	if m.hours() >= 1 then result.push m.hours() + 'h'
	if m.minutes() >= 1 then result.push m.minutes() + 'm'
	if m.seconds() >= 1 then result.push m.seconds() + 's'
	return chalk.yellow result.join ' '
	# todo: pad numbers with ' '
	# todo: ' ' between digits



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





node = chalk.gray '\u2022'   # `•`
bar = chalk.gray '|'

route = (route) ->
	lines = []
	lines.push ''
	for part, i in route.parts

		lines.push [
			''   # indentation
			node
			renderTime part.from.when
			if i is 0 then chalk.bold part.from.name else part.from.name   # first station?
		].join '  '

		lines.push '  ' + bar
		lines.push [
			''   # indentation
			bar
			''   # spacing
			renderDuration part.from.when, part.to.when
			# todo: number of stations
			partSymbol part
			chalk.gray '-> ' + part.direction
		].join '  '
		lines.push '  ' + bar

		if not route.parts[i + 1]   # last part, showing last station
			lines.push [
				''   # indentation
				node
				renderTime part.to.when
				chalk.bold part.to.name
			].join '  '

	lines.push ''
	console.log lines.join '\n'





module.exports = (program) ->
	return query program
	.then routes
	.then route
	.catch (err) ->
		console.error err.stack
		process.exit 1
	# todo: optionally show tickets
