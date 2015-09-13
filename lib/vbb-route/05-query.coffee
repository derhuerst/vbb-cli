hafas =			require 'vbb-hafas'
Q =				require 'q'
moment =		require 'moment'





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



client = hafas '2e9c6a18-8f2e-440c-a8bb-555e85cbeee9'

module.exports = (program) ->
	deferred = Q.defer()
	client.routes
		from:		program.from
		to:			program.to
		when:		program.when
		results:	program.results
		products:	program.products
	.then (results) ->
		program.query = results
		deferred.resolve program
	.catch (err) ->
		program.onError err
		deferred.reject err
	return deferred.promise
