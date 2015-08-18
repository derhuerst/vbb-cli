#!/usr/bin/env coffee

Q =				require 'q'
inquirer =		require 'inquirer'
c256 =			require 'colors-256'

vbb =			require 'vbb'
util =			require 'vbb-util'





station = (param, question) ->
	return (program) ->
		promisedStation = Q.defer()
		if program[param]
			program[param] = parseInt program[param]
			promisedStation.resolve program
			return promisedStation.promise
		inquirer.prompt [{
			type:		'autocomplete',
			name:		param,
			message:	question,
			choices:	() ->
				return (input) ->
					if not input
						promisedChoices = Q.defer()
						promisedChoices.resolve []
						return promisedChoices.promise
					return program.client.autocomplete input, 5
					.then (results) ->
						choices = []
						for result in results
							choices.push
								name:	result.name
								value:	result.id
						return choices
		}], (answers) ->
			program[param] = answers[param]
			promisedStation.resolve program
		return promisedStation.promise





results = (program) ->
	deferred = Q.defer()
	if program.results
		program.results = parseInt program.results
		deferred.resolve program
		return deferred.promise
	inquirer.prompt [{
		type:		'input',
		name:		'results',
		message:	'How many results?',
		default:	'5'
		validate:	(i) -> /\d+/.test i
	}], (answers) ->
		program.results = parseInt answers.results
		deferred.resolve program
	return deferred.promise





all =
	suburban:	true
	subway:		true
	tram:		true
	bus:		true
	ferry:		true
	express:	true
	regional:	true

parseProducts = (products) ->
	if products is 'all' then return all
	result = {}
	for product in products.split ','
		result[product] = true
	return result



products = (program) ->
	deferred = Q.defer()
	if program.products
		program.products = parseProducts program.products
		deferred.resolve program
		return deferred.promise
	inquirer.prompt [{
		type:		'checkbox',
		name:		'products',
		message:	'Which products do you want to use?',
		choices:	[
			{
				name:		'S-Bahn (suburban)'
				value:		'suburban'
				checked:	true
			}, {
				name:		'U-Bahn (subway)'
				value:		'subway'
				checked:	true
			}, {
				name:		'Tram (cable car)'
				value:		'tram'
				checked:	true
			}, {
				name:		'Bus'
				value:		'bus'
				checked:	true
			}, {
				name:		'Ferry'
				value:		'ferry'
				checked:	true
			}, {
				name:		'RE/RB (regional trains)'
				value:		'regional'
				checked:	true
			}, {
				name:		'ICE/IC/EC (express trains)'
				value:		'express'
				checked:	false
			}
		]
	}], (answers) ->
		program.products = parseProducts answers.products
		deferred.resolve program
	return deferred.promise





module.exports = (program) ->
	return station('from', 'Where are you?') program
	.then station 'to', 'Where do you want to go?'
	.then results
	.then products
