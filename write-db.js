const { db, Tasks, Notes } = require('./database')

Tasks.hasMany(Notes, { as: 'All_Notes', foreignKey: 'taskId' })

db.sync()
    .then(() => {
        Tasks.create({
            title: 'Db Created',
            description: 'project Node Js',
            due: '2020-04-12',
            status: false,
            priority: 'high'
        })
    }).then(() => {
        Notes.create({
            taskId: 1,
            text: 'My Second Note'
        })
    })
    .catch((err) => {
        console.error(err)
    })