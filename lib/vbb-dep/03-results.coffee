Q =				require 'q'
inquirer =		require 'inquirer'





module.exports = (program) ->
	if program.results
		program.results = parseInt program.results
		return program

	deferred = Q.defer()
	inquirer.prompt [{
		type:		'input',
		name:		'results',
		message:	'How many results?',
		default:	'8'
		validate:	(i) -> /\d+/.test i
	}], (answers) ->
		program.results = parseInt answers.results
		deferred.resolve program
	return deferred.promise
