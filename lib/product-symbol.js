'use strict'

const hafas = require('vbb-hafas')

const products = Object.create(null)
for (let p of hafas.profile.products) products[p.id] = p

const productSymbol = p => products[p] && products[p].short || null

module.exports = productSymbol
