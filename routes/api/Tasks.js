const route = require('express').Router()
const Task = require('../../database').Task
const Note = require('../../database').Note

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

exports = module.exports = route