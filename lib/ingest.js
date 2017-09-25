'use strict'

const modules = require('./modules')
const resources = require('./resources')

let Ingest = Object.assign({}, resources, modules)

// Export my resources and modules
module.exports = Ingest
