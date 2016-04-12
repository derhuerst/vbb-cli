'use strict'

const staticData         = require('vbb-static')
const autocomplete       = require('vbb-stations-autocomplete')
const autocompletePrompt = require('cli-autocomplete')
const parseTime          = require('parse-messy-time')
const datePrompt         = require('date-prompt')
const numberPrompt       = require('number-prompt')
const util               = require('vbb-util')
const chalk              = require('chalk')
const multiselectPrompt  = require('multiselect-prompt')
const hafas              = require('vbb-hafas')
const config             = require('config')



const isStationId = (s) => /^\d{7}$/.test(s.toString())

const parseStation = (query) => {
	if (isStationId(query))
		return staticData.stations(true, parseInt(query)) // search by id
	let results = autocomplete(query, 1)
	if (results.length > 0) return Promise.resolve(results[0])
	else throw new Error(`Could not anything by "${query}".`)
}

const suggestStations = (input) => autocomplete(input, 5)
	.map((r) => ({title: r.name, value: r.id}))
const queryStation = (msg) => new Promise((yay, nay) =>
	autocompletePrompt(msg, suggestStations).on('submit', yay)
	.on('abort', (v) => nay(new Error(`Rejected with ${v}.`))))



const parseWhen = parseTime

const queryWhen = (msg) => new Promise((yay, nay) =>
	datePrompt(msg).on('submit', (v) => yay(new Date(v)))
	.on('abort', (v) => nay(new Error(`Rejected with ${v}.`))))



const parseResults = (r, d) => {
	r = parseInt(r)
	return (Number.isNaN(r) || !r) ? d : r
}
const queryResults = (msg, d) => new Promise((yay, nay) =>
	numberPrompt(msg, {min: 1, value: d, max: 10})
	.on('submit', yay)
	.on('abort', (v) => nay(new Error(`Rejected with ${v}.`))))



const allProducts = ['suburban', 'subway', 'tram', 'bus', 'ferry', 'express', 'regional']
const isValidProduct = (p) => p in util.products.aliases
const dealiasProduct = (p) => util.products.aliases[p].type
const reduceProducts = (acc, p) => {
	acc[p] = true
	return acc
}
const parseProducts = (p) => {
	if (p === 'all') return allProducts.reduce(reduceProducts, {})
	if (!Array.isArray(p)) p = [p]
	return p.filter(isValidProduct).map(dealiasProduct)
		.reduce(reduceProducts, {})
}

const productColor = (p, s) => util.products[p].ansi
	.reduce((ch, c) => ch[c], chalk)(s)

const defaultProducts = ['suburban', 'subway', 'tram', 'bus', 'regional']
const productChoices = allProducts.map((name) => {
	const p = util.products[name]
	return {
		  value:    p.type
		, title:    productColor(p.type, p.short) + ' ' + p.name
		, selected: defaultProducts.indexOf(name) >= 0
	}
})

const queryProducts = (msg) => new Promise((yay, nay) =>
	multiselectPrompt(msg, productChoices)
	.on('abort', (v) => nay(new Error(`Rejected with ${v}.`)))
	.on('submit', (products) => yay(products.reduce((acc, p) => {
		acc[p.value] = p.selected
		return acc
	}, {}))))



const departures = (data) =>
	hafas.departures(config.key, data.station.id, data)



module.exports = {
	parseStation,  queryStation, isStationId, suggestStations,
	parseWhen,     queryWhen,
	parseResults,  queryResults,
	parseProducts, queryProducts,
	departures
}
