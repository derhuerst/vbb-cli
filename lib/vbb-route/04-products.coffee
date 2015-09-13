Q =				require 'q'
chalk =			require 'chalk'
inquirer =		require 'inquirer'

util =			require 'vbb-util'





all =
	suburban:	true
	subway:		true
	tram:		true
	bus:		true
	ferry:		true
	express:	true
	regional:	true



productColor = (product, text) ->
	product = util.products[product] or util.products.unknown
	styles = chalk
	for style in product.ansi
		if styles[style]
			styles = styles[style]
	return styles text



parseProducts = (products) ->
	result =
		suburban:	false
		subway:		false
		tram:		false
		bus:		false
		ferry:		false
		express:	false
		regional:	false
	if products is 'all' then return all
	else if typeof products is 'string' then products = products.split ','
	for product in products
		result[product] = true
	return result



module.exports = (program) ->
	if program.products
		return parseProducts program.products

	deferred = Q.defer()
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
