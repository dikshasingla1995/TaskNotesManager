const route = require('express').Router()

route.use('/notes',require('./Notes'))
route.use('/tasks',require('./Tasks'))

exports = module.exports = {
    route
}