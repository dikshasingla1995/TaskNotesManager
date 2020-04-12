const route = require('express').Router()
route.get('/', async (req, res) => {
    if (isNaN(Number(req.params.id))) {
        return res.status(400).send({
            error: 'task id must be an integer',
        })
    }
    const task = await Task.findByPk(req.params.id, {
        include: [{
            model: Note,
            as: 'All_Notes',
            attributes: ['noteId', 'text']
        }]
    })
    if (!task) {
        return res.status(404).send({
            error: 'No task found with id = ' + req.params.id,
        })
    }
    res.send(task)
})

//add a new note under task with a particular id
route.post('/', async (req, res) => {
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