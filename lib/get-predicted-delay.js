'use strict'

const Promise = require('pinkie-promise')
const {fetch} = require('fetch-ponyfill')({Promise})
const floor = require('floordate')

const daysOfWeek = [
	'sunday',
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday'
]

// todo: HTTPS, GET
const endpoint = 'http://vbb-delay-prediction.jannisr.de:8080/prediction'

const getPredictedDelay = (dep) => {
	const w = new Date(dep.when)
	const time = (w - floor(w, 'day')) / 1000
	const dayOfWeek = daysOfWeek[w.getDay()]

	const req = {
		time, dayOfWeek,
		line: dep.line && dep.line.name || null,
		product: dep.line && dep.line.product || null
	}

	return fetch(endpoint, {
		method: 'post',
		mode: 'cors',
		redirect: 'follow',
		headers: {
			'User-Agent': 'vbb-cli',
			'content-type': 'application/json'
		},
		body: JSON.stringify(req)
	})
	.then((res) => {
		if (!res.ok) {
			const err = new Error(res.statusText)
			err.statusCode = res.status
			throw err
		}
		return res.json()
	})
	.then(([data]) => { // todo: why in an array?
		// todo: confidence
		return data && data.prediction || null
	})
}

module.exports = getPredictedDelay
