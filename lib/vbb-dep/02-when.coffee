moment =		require 'moment'
Promise =		require 'bluebird'
datePrompt =	require 'date-prompt'





module.exports = (program) ->
	if program.when
		program.when = new Date 0 + moment program.when
		return program

	new Promise (resolve, reject) ->
		datePrompt 'When do you want to travel?'
		.date.then (value) ->
			program.when = new Date 0 + value
			deferred.resolve program
		.catch (err) ->
			program.onError err
			deferred.reject err
		return deferred.promise
