Q =				require 'q'
inquirer =		require 'inquirer'

Autocomplete =	require 'vbb-stations-autocomplete'





autocomplete = Autocomplete()



# todo: search if autocomplete fails

query = (key, question) ->
	return (program) ->
		deferred = Q.defer()

		if program[key]
			program[key] = parseInt program[key]
			deferred.resolve program
			return deferred.promise

		inquirer.prompt [{
			type:		'autocomplete',
			name:		key,
			message:	question,
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
			program[key] = answers[key]
			deferred.resolve program
		return deferred.promise



module.exports = (program) ->
	return query('from', 'Where are you?') program
	.then query 'to', 'Where do you want to go?'
