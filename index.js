"use strict";
const config = require('./config');

const ccxt = require ('ccxt')

let exchange = new ccxt[config.exchange]()
console.log(exchange)
