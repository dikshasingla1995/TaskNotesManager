const { db, Task, Note } = require('./database')

Task.hasMany(Note, { as: 'All_Notes', foreignKey: 'taskId' })

db.sync()
    .then(() => {
        Task.create({
            title: 'Db Created',
            description: 'project Node Js',
            due: '2020-04-12',
            status: false,
            priority: 'high'
        })
    }).then(() => {
        Note.create({
            taskId: 1,
            text: 'My Second Note'
        })
    })
    .catch((err) => {
        console.error(err)
    })