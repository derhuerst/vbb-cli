Promise =		require 'bluebird'
inquirer =		require 'inquirer'

autocomplete =	require 'vbb-stations-autocomplete'





# todo: search if autocomplete fails

module.exports = (program) ->
	if program.station?
		program.station = parseInt program.station
		return program

	new Promise (resolve, reject) ->
		inquirer.prompt [{
			type:		'autocomplete',
			name:		'station',
			message:	'Where are you?',
			choices:	() -> (input) ->
				return Promise.resolve [] unless input
				return autocomplete(input, 5)
					.map (result) -> name: result.name, value: result.id
		}], (answers) ->
			program.station = answers.station
			resolve program
