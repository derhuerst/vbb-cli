'use strict'

const util     = require('vbb-util')
const kuler    = require('kuler')
const chalk    = require('chalk')
const ms       = require('ms')
const moment   = require('moment')
const Table    = require('cli-table2')
const pad      = require('pad-right')



const product = (p) => {
	p = util.products[p]
	return p ? kuler(p.short, p.color) : ''
}

const transport = (t, p) => {
	t = util.lines.legs.types[t]
	return t
		? (t.type === 'public'
			? product(p)
			: t.unicode)
		: chalk.gray('?')
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
	return p.map((p) => transport(p.transport, p.type)).join(' ')
	+ ' ' + chalk.yellow(ms(p[p.length - 1].end - p[0].start))
	+ '   ' + chalk.gray(time(p[0].start) + '–' + time(p[p.length - 1].end))
}

const bar  = chalk.gray('|')
const node = chalk.gray('•')

const part = (acc, p, i, all) => {
	const r = []
	if (i === 0) r.push(node + ' '
		+ chalk.cyan(time(p.start)) + ' ' + chalk.green(p.from.name))
	r.push([bar, ' '
		, chalk.yellow(pad(ms(p.end - p.start), 4, ' '))
		, transport(p.transport, p.type)
		, (p.line ? line(p.line) : '')
		, chalk.gray('-> ') + p.direction
		, i > 0 ? chalk.gray(ms(p.start - all[i - 1].end) + ' waiting') : ''
	].join(' '))
	r.push(node + ' ' + chalk.cyan(time(p.end)) + ' '
		+ chalk.green(p.to.name))
	acc += r.join('\n') + '\n'
	return acc
}

const routeDetails = (r) => '\n' + r.parts.reduce(part, '') + '\n'



module.exports = {
	product, transport, line,
	scheduled, realtime, time,
	station, table,
	route, routeDetails
}
