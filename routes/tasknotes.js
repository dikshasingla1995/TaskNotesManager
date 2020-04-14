const { Router } = require('express')
const { Task, Note } = require('../database')

const route = Router()

//to get all tasks in an array
route.get('/', async (req, res) => {
  const tasks = await Task.findAll()
  res.send(tasks)
})
//{ order: [['status', 'DESC']]}

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
  const newTask = await Task.create({
    title: req.body.title,
    description: req.body.description,
    due: req.body.due,
    status: req.body.status,
    priority: req.body.priority
  })
  res.status(201).send({ success: 'New task added', data: newTask })
})

//to update details of a task with particular id
route.patch('/:id', async (req, res) => {
  if (isNaN(Number(req.params.id))) {
    return res.status(400).send({
      error: 'task id must be an integer',
    })
  }
  Task.update({
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

//get list of all notes under task with given id
route.get('/:id/notes', async (req, res) => {
  if (isNaN(Number(req.params.id))) {
    return res.status(400).send({
      error: 'task id must be an integer',
    })
  }
  const task = await Task.findByPk(req.params.id, {
    include: [
      {
        model: Note,
        as: 'All_Notes',
        attributes: ['noteId', 'text']
      }
    ]
  })
  if (!task) {
    return res.status(404).send({
      error: 'No task found with id = ' + req.params.id,
    })
  }
  res.send(task)
})

//add a new note under task with a particular id
route.post('/:id/notes', async (req, res) => {
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
  const newNote = await Note.create({
    taskId: req.params.id,
    text: req.body.text
  })
  res.status(201).send({ success: 'New Note added', data: newNote })
})

module.exports = route