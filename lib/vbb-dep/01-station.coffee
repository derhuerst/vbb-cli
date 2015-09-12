Q =				require 'q'
inquirer =		require 'inquirer'

Autocomplete =	require 'vbb-stations-autocomplete'





autocomplete = Autocomplete()



# todo: search if autocomplete fails

module.exports = (program) ->
	if program.station
		program.station = parseInt program.station
		return program

	deferred = Q.defer()
	inquirer.prompt [{
		type:		'autocomplete',
		name:		'station',
		message:	'Where are you?',
		choices:	() ->
			return (input) ->
				if not input
					promisedChoices = Q.defer()
					promisedChoices.resolve []
					return promisedChoices.promise
				return autocomplete.suggest input, 5
				.then (results) ->
					choices = []
					for result in results
						choices.push
							name:	result.name
							value:	result.id
					return choices
	}], (answers) ->
		program.station = answers.station
		deferred.resolve program
	return deferred.promise
