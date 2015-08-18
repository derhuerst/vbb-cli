#!/usr/bin/env coffee

Q =				require 'q'
inquirer =		require 'inquirer'
chalk =			require 'chalk'

vbb =			require 'vbb'
util =			require 'vbb-util'





station = (param, question) ->
	# todo: search when autocompletion falied
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
	if typeof products is 'string' then products = products.split ','
	result = {}
	for product in products
		result[product] = true
	return result



productColor = (product, text) ->
	product = util.products[product] or util.products.unknown
	styles = chalk
	for style in product.ansi
		if styles[style]
			styles = styles[style]
	return styles text



products = (program) ->
	deferred = Q.defer()
	if program.products
		program.products = parseProducts program.products
		deferred.resolve program
		return deferred.promise
	choices = []
	for product in util.products.categories
		continue if product.type is 'unknown'
		choices.push
			name: [
				productColor product.type, product.short
				chalk.gray product.name
			].join ' '
			value:		product.type
			checked:	if product.type is 'express' then false else true
	inquirer.prompt [{
		type:		'checkbox',
		name:		'products',
		message:	'Which products do you want to use?',
		choices:	choices
	}], (answers) ->
		program.products = parseProducts answers.products
		deferred.resolve program
	return deferred.promise





module.exports = (program) ->
	return station('from', 'Where are you?') program
	.then station 'to', 'Where do you want to go?'
	# todo: support picking a date
	.then results
	.then products
