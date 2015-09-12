chalk =			require 'chalk'





module.exports = (err) ->
	if err.code?
		process.stderr.write chalk.red err.code + ' – '
	process.stderr.write chalk.red.bold err.message + ' '
	if err.stack? then process.stderr.write err.stack
	process.exit 1
