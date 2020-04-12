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

//to get details of a task with id
route.get('/:id', async (req, res) => {
    if (isNaN(Number(req.params.id))) {
        return res.status(400).send({
            error: 'task id must be an integer',
        })
    }
    const task = await Task.findByPk(req.params.id)
    if (!task) {
        return res.status(404).send({
            error: 'No task found with id = ' + req.params.id,
        })
    }
    res.send(task)
})

//to add a new task
route.post('/', async (req, res) => {
    await Task.create({
        title: req.body.title,
        description: req.body.description,
        due: req.body.due,
        status: req.body.status,
        priority: req.body.priority
    }).then((task) => {
        res.status(201).send({ success: 'New task added', data: task })
    }).catch((error) => {
        res.status(500).send({
            error: "Could not add new task"
        })
    })
})

//to update details of a task with particular id
route.patch('/:id', async (req, res) => {
    if (isNaN(Number(req.params.id))) {
        return res.status(400).send({
            error: 'task id must be an integer',
        })
    }
    Task.update({
        title: req.body.title,
        description: req.body.description,
        due: req.body.due,
        status: req.body.status,
        priority: req.body.priority
    }, {
        where: {
            taskId: req.params.id
        }
    }).then(rows => {
        res.json(rows)
    }).catch(error => {
        console.log(error)
        res.status(404).send(error)
    })
})

exports = module.exports = route