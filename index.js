'use strict'

const client = require('vbb-client')
const autocompletePrompt = require('cli-autocomplete')
const parseTime          = require('parse-messy-time')
const datePrompt         = require('date-prompt')
const numberPrompt       = require('number-prompt')
const util               = require('vbb-util')
const chalk              = require('chalk')
const multiselectPrompt  = require('multiselect-prompt')
const selectPrompt       = require('select-prompt')

const render             = require('./render')



const isStationId = (s) => /^\d{12}$/.test(s.toString())

const parseStation = (query) => {
	if (isStationId(query)) return client.station(+query)

	return client.stations({
		query, results: 1,
		identifier: 'vbb-cli'
	})
	.then(([station]) => {
		if (!station) throw new Error('Station not found.')
		return station
	})
}

const suggestStations = (input) => {
	if (!input || input === '') return Promise.resolve([])

	return client.stations({
		query: input,
		completion: true,
		results: 5,
		identifier: 'vbb-cli'
	})
	.then((stations) => {
		return stations.slice(0, 5).map((s) => {
			return {title: s.name + ' – ' + s.id, value: s.id}
		})
	})
}

const queryStation = (msg) => {
	return new Promise((yay, nay) => {
		autocompletePrompt(msg, suggestStations)
		.on('submit', yay)
		.on('abort', (val) => {
			nay(new Error(`Rejected with ${val}.`))
		})
	})
}

const closeStations = (loc) =>
	client.nearby({
		latitude:  loc.latitude,
		longitude: loc.longitude,
		results:   3
	})

const queryCloseStations = (msg, loc) => {
	return closeStations(loc)
	.then((stations) => {
		return new Promise((yay, nay) => {
			selectPrompt(msg, stations.slice(0, 10).map((s) => ({
				  title: s.name, value: s.id
			})))
			.on('submit', yay)
			.on('abort', (val) => nay(new Error(`Rejected with ${val}.`)))
		})
	})
}



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

const parseDuration = (x, d) => {
	x = parseInt(x)
	return (Number.isNaN(x) || !x) ? d : x
}
const queryDuration = (msg, d) => new Promise((yay, nay) =>
	numberPrompt(msg, {min: 1, value: d, max: 15})
	.on('submit', yay)
	.on('abort', (v) => nay(new Error(`Rejected with ${v}.`))))



const noProduct = {
	suburban: false,
	subway:   false,
	tram:     false,
	bus:      false,
	ferry:    false,
	express:  false,
	regional: false
}
const allProducts = Object.keys(noProduct)

const isValidProduct = (p) => p in util.products.aliases
const dealiasProduct = (p) => util.products.aliases[p].type
const reduceProducts = (acc, p) => {
	acc[p] = true
	return acc
}
const parseProducts = (p) => {
	if (p === 'all') return allProducts.reduce(reduceProducts, {})
	if (!Array.isArray(p)) p = [p]
	const obj = Object.assign(Object.create(null), noProduct)
	return p
	.filter(isValidProduct)
	.map(dealiasProduct)
	.reduce(reduceProducts, obj)
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



const queryJourney = (msg, journeys) => {
	const choices = journeys.map((r) => {
		return {title: render.journey(r), value: r}
	})
	return new Promise((yay, nay) => {
		selectPrompt(msg, choices)
		.once('abort', v => nay(new Error(`Rejected with ${v}.`)))
		.once('submit', yay)
	})
}



const departures = (data) => {
	data.identifier = 'vbb-cli'
	return client.departures(data.station.id, data)
}

const journeys = (data) => {
	data.identifier = 'vbb-cli'
	return client.journeys(data.from.id, data.to.id, data)
}



module.exports = {
	parseStation,  queryStation, isStationId, suggestStations,
	closeStations, queryCloseStations,
	parseWhen,     queryWhen,
	parseResults,  queryResults,
	parseDuration, queryDuration,
	parseProducts, queryProducts,
	queryJourney,
	departures, journeys
}
