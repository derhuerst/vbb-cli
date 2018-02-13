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
	return p && p.short && p.color ? kuler(p.short, p.color) : ''
}

const transport = (d) => {
	if (d && d.line) return product(d.line.product)
	if (d.type === 'walking') return util.lines.legs.types.walk.unicode
	return chalk.gray('?')
}

const line = (l) => {
	if (util.lines.colors[l.product] && util.lines.colors[l.product][l.name]) {
		return kuler(l.name, util.lines.colors[l.product][l.name].bg)
	}
	if (l.metro) return kuler(l.name, util.lines.colors.metro.bg)
	return chalk.gray(l.name)
}

const when = (when) => {
	const d = when - Date.now()
	return chalk.cyan((d < 0 ? '-' : '') + ms(Math.abs(d)))
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
	style: {'padding-left': 0, 'padding-right': 0}
})


const journey = (r) => {
	const l = r.legs
	return [
		l.map(transport).join(chalk.gray(', ')),
		' ',
		chalk.yellow(ms(l[l.length - 1].arrival - l[0].departure)),
		'   ',
		chalk.gray(time(l[0].departure) + '–' + time(l[l.length - 1].arrival))
	].join('')
}

const bar  = chalk.gray('|')
const node = chalk.gray('•')
const arrow = chalk.gray('-> ')

const leg = (acc, p, i, all) => {
	if (i === 0) {
		acc.push([
			node,
			chalk.cyan(time(p.departure)),
			chalk.green(p.origin.name)
		])
	}
	acc.push([
		bar,
		chalk.yellow(pad(ms(p.arrival - p.departure), 3, ' ')),
		' ',
		transport(p) + (p.line ? ' ' + line(p.line) : ''),
		arrow + p.direction,
		i > 0 ? chalk.gray(ms(p.departure - all[i - 1].arrival) + ' waiting') : ''
	])
	acc.push([
		node,
		chalk.cyan(time(p.arrival)),
		chalk.green(p.destination.name)
	])
	return acc
}

const journeyDetails = (r) => {
	return '\n' + r.legs.reduce(leg, table()).toString() + '\n\n'
}



module.exports = {
	product, transport, line,
	when, time,
	station, table,
	journey, journeyDetails
}
