'use strict'

const {lines} = require('vbb-util')

const lineColor = (l) => {
	let c = lines.colors[l.product]
	if (c && c[l.name] && c[l.name].bg) return c[l.name].bg
	if (l.metro) return lines.colors.metro.bg
	return '#999999'
}

module.exports = lineColor
