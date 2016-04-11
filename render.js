'use strict'

const util     = require('vbb-util')
const kuler    = require('kuler')
const chalk    = require('chalk')
const ms       = require('ms')
const Table    = require('cli-table2')



const product = (p) => {
	p = util.products[p]
	return p ? kuler(p.short, p.color) : ''
}

const line = (l) =>
	(l && util.lines.colors[l.type] && util.lines.colors[l.type][l._])
	? kuler(l._, util.lines.colors[l.type][l._].bg)
	: l.metro
		? kuler(l._, util.lines.colors.metro.bg)
		: l._

const scheduled = (scheduled) => {
	const d = scheduled - Date.now()
	return chalk.cyan((d < 0 ? '-' : '') + ms(Math.abs(d)))
}

const realtime = (scheduled, realtime) => {
	if (!realtime) return ''
	if (Math.abs(realtime - scheduled) / 1000 <= 5) return ''
	const d = realtime - scheduled
	return chalk.red((d < 0 ? '-' : '+') + ms(Math.abs(d)))
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



module.exports = {product, line, scheduled, realtime, station, table}
