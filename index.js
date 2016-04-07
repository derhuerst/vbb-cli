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



const isStationId = (station) => /^\d{7}$/.test(station)

const parseStation = (query) => {
	if (isStationId(query))
		return staticData.stations(true, parseInt(query)) // search by id
	let results = autocomplete(query, 1)
	if (results.length > 0) return Promise.resolve(results[0])
	else throw new Error(`Could not anything by "${query}".`)
}

const suggestStations = (input) => autocomplete(input, 5)
	.map((r) => ({title: r.name, value: r.id}))
const queryStation = (msg) => new Promise((resolve, reject) =>
	autocompletePrompt(msg, suggestStations).on('submit', resolve)
	.on('abort', (v) => reject(new Error(`Rejected with ${v}.`))))



const parseWhen = parseTime

const queryWhen = (msg) => new Promise((resolve, reject) =>
	datePrompt(msg).on('submit', (v) => resolve(new Date(v)))
	.on('abort', (v) => reject(new Error(`Rejected with ${v}.`))))



const parseResults = (r) => {
	r = parseInt(r)
	return (Number.isNaN(r) || !r) ? 3 : r
}
const queryResults = (msg) => new Promise((resolve, reject) =>
	numberPrompt(msg, {min: 1, value: 3, max: 10}).on('submit', resolve)
	.on('abort', (v) => reject(new Error(`Rejected with ${v}.`))))



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

const defaultProducts = ['suburban', 'subway', 'tram', 'bus', 'regional']
const productChoices = allProducts.map((name) => {
	const p = util.products[name]
	return {
		  value:    p.type
		, title:    productColor(p.type, p.short) + ' ' + p.name
		, selected: defaultProducts.indexOf(name) >= 0
	}
})

const queryProducts = (msg) => new Promise((resolve, reject) =>
	multiselectPrompt(msg, productChoices)
	.on('abort', (v) => reject(new Error(`Rejected with ${v}.`)))
	.on('submit', (products) => resolve(products.reduce((acc, p) => {
		acc[p.value] = p.selected
		return acc
	}, {}))))



const fetch = (data) => hafas.departures(config.key, data.station.id, data)



module.exports = {
	parseStation,  queryStation, isStationId, suggestStations,
	parseWhen,     queryWhen,
	parseResults,  queryResults,
	parseProducts, queryProducts,
	fetch
}
