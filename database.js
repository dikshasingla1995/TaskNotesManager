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
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    description: {
        type: Sequelize.TEXT,
        allowNull : false
    },
    due: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate:{
            isDate: true
        }
    },
    status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        validate:{
            isBoolean: true
        }
    },
    priority: {
        type: Sequelize.NUMBER,
        defaultValue: 2,
        allowNull: false,
        validate: {
            isIn: [[1, 2, 3]]
        }
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
        allowNull: false,
        validate:{
            notEmpty: true
        }
    }
})

Task.hasMany(Note, { as: 'All_Notes', foreignKey: 'taskId' })

db.sync()
    .then(() => console.log("Database has been synced"))
    .catch(() => console.log("Error creating database"))

module.exports = {
    Task, Note
}