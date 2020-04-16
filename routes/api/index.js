const route = require('express').Router()

route.use('/tasks',require('./Tasks'))

exports = module.exports = {
    route
}