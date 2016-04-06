'use strict'

const staticData        = require('vbb-static')
const autocomplete      = require('vbb-stations-autocomplete')
const completion        = require('cli-autocomplete')
const parseTime         = require('parse-messy-time')
const datePrompt        = require('date-prompt')
const numberPrompt      = require('number-prompt')
const util              = require('vbb-util')
const chalk             = require('chalk')
const multiselectPrompt = require('multiselect-prompt')



const isStationId = (station) => /^\d{7}$/.test(station)

const parseStation = (query) => {
	if (isStationId(query))
		return staticData.stations(true, parseInt(query)) // search by id
	let results = autocomplete(query, 1)
	if (results.length > 0) return Promise.resolve(results[0])
	else throw new Error(`Could not anything by "${query}".`)
}

const resultToSuggestion = (r) => ({title: r.name, value: r.id})
const queryStation = (message) => completion(message, {
	suggest: (input) => autocomplete(input, 5).map(resultToSuggestion)
})



const parseWhen = parseTime

const queryWhen = datePrompt



const parseResults = (r) => {
	r = parseInt(r)
	return (Number.isNaN(r) || !r) ? 3 : r
}
const queryResults = (msg) => numberPrompt(msg, {min: 0, value: 3, max: 10})



const allProducts = ['suburban', 'subway', 'tram', 'bus', 'ferry', 'express', 'regional']
const isValidProduct = (p) => allProducts.indexOf(x) >= 0
const reduceProducts = (acc, p) => {
	acc[p] = true
	return acc
}
const parseProducts = (p) => {
	if (p === 'all') return allProducts.reduce(reduceProducts, {})
	if ('string' === typeof p) return p.split(',').map(trim)
		.filter(isValidProduct).reduce(reduceProducts, {})
}

const productColor = (p, s) => util.products[p].ansi
	.reduce((ch, c) => ch[c], chalk)(s)
const productChoices = allProducts.map((p) => {
	p = util.products[p]
	return {value: p.type, title: productColor(p.type, p.short) + ' ' + p.name}
})
const queryProducts = (msg) => multiselectPrompt(msg, productChoices)



module.exports = {
	parseStation,  queryStation, isStationId, resultToSuggestion,
	parseWhen,     queryWhen,
	parseResults,  queryResults,
	parseProducts, queryProducts
}
