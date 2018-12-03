'use strict'

const {products} = require('vbb-util') // todo: move this into a separate package

const productColor = p => products[p] && products[p].color || '#999999'

module.exports = productColor
