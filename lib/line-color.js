'use strict'

const lineColors = require('vbb-line-colors')

const defaultColor = '#999999'
const metroColor = '#f3791d'

const lineColor = (l) => {
	let c = lineColors[l.product]
	if (!c || !l.name) return defaultColor
	const lName = l.name.trim().toUpperCase()
	if (c[lName] && c[lName].bg) return c[lName].bg
	if (l.metro) return metroColor
	return defaultColor
}

module.exports = lineColor
