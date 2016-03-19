'use strict'

const staticData   = require('vbb-static')
const autocomplete = require('vbb-stations-autocomplete')



const isStationId = (station) => /^\d{7}$/.test(station)

const parseStation = (station) =>
	isStationId(station)
	? staticData.stations(true, parseInt(station))
	: Promise.resolve(autocomplete(station, 1)[0])



module.exports = {isStationId, parseStation}
