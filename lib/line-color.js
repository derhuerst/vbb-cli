'use strict'

const lineColors = require('vbb-line-colors')

const lineColor = (l) => {
	let c = lineColors[l.product]
	if (c && c[l.name] && c[l.name].bg) return c[l.name].bg
	if (l.metro) return lines.colors.metro.bg
	return '#999999'
}

module.exports = lineColor
