'use strict'

const chalk    = require('chalk')
const ms       = require('ms')
const util     = require('vbb-util')
const Table    = require('cli-table2')



const product = (p) => {
	p = util.products[p]
	return p.ansi.reduce((acc, c) => acc[c], chalk)(p.short)
}

const time = (when) => {
	let d = when - Date.now()
	return chalk.cyan((d < 0 ? '-' : '') + ms(Math.abs(d)))
}

const station = (name) => chalk.yellow(name)

const table = () => new Table({
	chars: {
		top:    '', 'top-mid':    '', 'top-left':    '', 'top-right':    '',
		bottom: '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '',
		left:   '', 'left-mid':   '',  mid:          '', 'mid-mid':      '',
		right:  '', 'right-mid':  '',  middle:       ' '
	},
	style: {'padding-left': 1, 'padding-right': 0}
})



module.exports = {product, time, station, table}
