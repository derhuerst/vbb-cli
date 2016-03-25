'use strict'

const staticData   = require('vbb-static')
const autocomplete = require('vbb-stations-autocomplete')
const completion   = require('cli-autocomplete')
const parseTime    = require('parse-messy-time')
const datePrompt   = require('date-prompt')



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



module.exports = {
	isStationId, parseStation,
	resultToSuggestion, queryStation,
	parseWhen, queryWhen
}
