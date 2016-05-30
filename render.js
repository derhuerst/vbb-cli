'use strict'

const util     = require('vbb-util')
const kuler    = require('kuler')
const chalk    = require('chalk')
const ms       = require('ms')
const moment   = require('moment')
const Table    = require('cli-table2')
const pad      = require('pad-right')



const product = (p) => {
	if (p && p.product && p.product.type)
		return kuler(p.product.type.short, p.product.type.color)
	else return ''
}

const transport = (p) => {
	t = util.lines.legs.types[p.type]
	if (t) {
		if (t.type === 'public') return product(p)
		else return t.unicode
	} else return chalk.gray('?')
}

const line = (l) => {
	if (l && util.lines.colors[l.type] && util.lines.colors[l.type][l._])
		return kuler(l._, util.lines.colors[l.type][l._].bg)
	if (l.metro) return kuler(l._, util.lines.colors.metro.bg)
	return l._
}

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

const time = (when) => moment(when).format('LT')

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


const route = (r) => {
	const p = r.parts
	return p.map(transport).join(' ')
	+ ' ' + chalk.yellow(ms(p[p.length - 1].end - p[0].start))
	+ '   ' + chalk.gray(time(p[0].start) + '–' + time(p[p.length - 1].end))
}

const bar  = chalk.gray('|')
const node = chalk.gray('•')

const part = (acc, p, i, all) => {
	if (i === 0) acc.push([node
		, chalk.cyan(time(p.start))
		, chalk.green(p.from.name)
	])
	acc.push([bar
		, chalk.yellow(pad(ms(p.end - p.start), 3, ' '))
		+ ' ' + transport(p)
		+ (p.line ? ' ' + line(p.line) : '')
		, chalk.gray(' -> ') + p.direction
		, i > 0 ? chalk.gray(ms(p.start - all[i - 1].end) + ' waiting') : ''
	])
	acc.push([node
		, chalk.cyan(time(p.end))
		, chalk.green(p.to.name)
	])
	return acc
}

const routeDetails = (r) =>
	'\n' + r.parts.reduce(part, table()).toString() + '\n\n'



module.exports = {
	product, transport, line,
	scheduled, realtime, time,
	station, table,
	route, routeDetails
}
