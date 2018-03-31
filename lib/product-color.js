'use strict'

const {products} = require('vbb-util')

const productColor = p => products[p] && products[p].color || '#999999'

module.exports = productColor
