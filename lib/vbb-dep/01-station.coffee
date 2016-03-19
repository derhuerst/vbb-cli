prompt =		require 'cli-autocomplete'

autocomplete =	require 'vbb-stations-autocomplete'





# todo: search if autocomplete fails

module.exports = (program) ->
	if program.station?
		program.station = parseInt program.station
		return program

	prompt('Where are you?', suggest: (query) ->
		autocomplete(query, 3).map (s) -> {title: s.name, value: s.id}
	).then (station) -> Object.assign(program, {station})
