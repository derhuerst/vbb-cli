'use strict'

const padRight = require('pad-right')
const chalk    = require('chalk')
const ms       = require('ms')
const util     = require('vbb-util')



const align = (s, l) => padRight(s, 100, ' ').slice(0, l)

const product = (p) => {
	p = util.products[p]
	return p.ansi.reduce((acc, c) => acc[c], chalk)(p.short)
}

const time = (when) => {
	let d = when - Date.now()
	return chalk.cyan(align(
		(d < 0 ? '-' : ' ') + ms(Math.abs(d)), 5))
}

const station = (name) => align(name, 30)



module.exports = {product, time, station}
