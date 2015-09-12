Q =				require 'q'
inquirer =		require 'inquirer'
chalk =			require 'chalk'
moment =		require 'moment'

util =			require 'vbb-util'





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



module.exports = (program) ->
	choices = []
	for result in program.query
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
		program.route = answers.route
		deferred.resolve program

	return deferred.promise
