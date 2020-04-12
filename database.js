const Sequelize = require('sequelize')

const db = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/tasknote.db'
})

const Task = db.define('tasks', {
    taskId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT
    },
    due: {
        type: Sequelize.DATE,
        allowNull: false
    },
    status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    priority: {
        type: Sequelize.STRING,
        defaultValue: 'medium',
        allowNull: false
    }
})

const Note = db.define('notes', {
    noteId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    text: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Task.hasMany(Note, { as: 'All_Notes', foreignKey: 'taskId' })

db.sync({force : true})
    .then(() => console.log("Database has been synced"))
    .catch(() => console.log("Error creating database"))

module.exports = {
    Task, Note
}