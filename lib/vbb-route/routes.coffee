#!/usr/bin/env coffee

Q =				require 'q'
inquirer =		require 'inquirer'
chalk =			require 'chalk'
moment =		require 'moment'

util =			require 'vbb-util'





query = (program) ->
	return program.client.routes
		from:		program.from
		to:			program.to
		results:	program.results
		products:	program.products




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
		return productColor part.type, product.short
	else return util.routes.legs.types[part.transport].unicode + ' '

lineSymbol = (part) ->
	if part.transport is 'public'
		return productColor part.type, part.line
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





renderTime = (timestamp) ->
	return chalk.cyan moment(timestamp).format 'HH:mm'

renderDuration = (start, stop) ->
	if stop? then m = moment.duration stop - start
	else m = moment.duration start
	result = []
	if m.hours() >= 1 then result.push m.hours() + 'h'
	if m.minutes() >= 1 then result.push m.minutes() + 'm'
	if m.seconds() >= 1 then result.push m.seconds() + 's'
	return chalk.yellow result.join ' '
	# todo: pad numbers with ' '



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
wait = chalk.gray '\u22ee'   # `⋮`

# todo: show realtime information

route = (route) ->
	lines = []
	lines.push ''
	previous = null
	for part, i in route.parts

		if previous
			lines.push ''
			lines.push [
				'  '   # indentation
				wait
				'         '   # indentation
				chalk.gray 'wait for '
				renderDuration previous.to.when, part.from.when
			].join ''
			lines.push ''

		lines.push [
			''   # indentation
			node
			renderTime part.from.when
			if i is 0
				chalk.bold part.from.name
			else part.from.name   # first station?
		].join '  '

		lines.push '  ' + bar
		lines.push [
			''   # indentation
			bar
			''   # spacing
			renderDuration part.from.when, part.to.when
			# todo: number of stations
			lineSymbol part
			chalk.gray '-> ' + part.direction
		].join '  '
		lines.push '  ' + bar

		lines.push [
			''   # indentation
			node
			renderTime part.to.when
			# todo: fix the following
			if i is route.parts.length - 1
				chalk.bold part.to.name
			else part.to.name   # last station?
		].join '  '

		previous = part
	lines.push '', ''
	process.stdout.write lines.join '\n'





module.exports = (program) ->
	return query program
	.then routes
	.then route
	.catch (err) ->
		console.error err.stack
		process.exit 1
	# todo: optionally show tickets
