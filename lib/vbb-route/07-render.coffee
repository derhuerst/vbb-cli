chalk =			require 'chalk'
moment =		require 'moment'

util =			require 'vbb-util'





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



node = chalk.gray '\u2022'   # `•`
bar = chalk.gray '|'
wait = chalk.gray '\u22ee'   # `⋮`

# todo: show realtime information

module.exports = (program) ->
	lines = []
	lines.push ''
	previous = null
	for part, i in program.route.parts

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
			if i is program.route.parts.length - 1
				chalk.bold part.to.name
			else part.to.name   # last station?
		].join '  '

		previous = part
	lines.push '', ''
	process.stdout.write lines.join '\n'
	return program
