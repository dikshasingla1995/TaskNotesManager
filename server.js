const express = require('express')
const path = require('path')
const tasknotesRoute = require('./routes/tasknotes')

const app = express()

app.use(express.json())

app.use('/', express.static(path.join(__dirname , 'public')))

app.use('/api',require('./routes/api').route)

app.use('/tasknotes', tasknotesRoute)

app.listen(6543,()=>console.log('Server started at http://localhost:6543'))