const route = require('express').Router()
const Task = require('../../database').Task

//to get all tasks in an array
route.get('/', async (req, res) => {
    await Task.findAll().then((tasks) => {
        res.status(200).send(tasks)
    }).catch((error) => {
        res.status(500).send({
            error: "Could not retrieve tasks"
        })
    })
})

//to add a new task
route.post('/', async (req, res) => {
    await Task.create({
      title: req.body.title,
      description: req.body.description,
      due: req.body.due,
      status: req.body.status,
      priority: req.body.priority
    }).then((task)=>{
        res.status(201).send({ success: 'New task added', data: task })
    }).catch((error) => {
        res.status(500).send({
            error: "Could not add new task"
        })
    })
})

exports = module.exports = route