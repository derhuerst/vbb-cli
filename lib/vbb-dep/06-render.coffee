chalk =			require 'chalk'
moment =		require 'moment'

util =			require 'vbb-util'





moment.locale 'en',
	relativeTime:
		future:	'%s'
		past:	'%s ago'
		s:		'%ds'
		m:		'1m'
		mm:		'%dm'
		h:		'1h'
		hh:		'%dh'
		d:		'1d'
		dd:		'%dd'
		M:		'1M'
		MM:		'%dM'
		y:		'1y'
		yy:		'%dy'





productColor = (product, text) ->
	product = util.products[product] or util.products.unknown
	styles = chalk
	for style in product.ansi
		if styles[style]
			styles = styles[style]
	return styles text

renderTime = (timestamp, relatively) ->
	now = new Date()

	if relatively
		if 20 >= Math.abs(timestamp - now) / 1000
			return chalk.green ' now'
		else if now > timestamp
			return chalk.gray '-' + moment(timestamp).to now
		else return chalk.yellow ' ' + moment(now).to timestamp

	else return moment(timestamp).format 'HH:mm'





module.exports = (program) ->
	lines = []
	for result in program.query

		lines.push [
			renderTime result.when, program.relative
			productColor result.type, result.line
			result.direction
		].join '\t'   # todo: pad parts with `' '` instead

	lines = lines.join '\n'
	process.stdout.write "\n#{lines}\n\n"
	return program
