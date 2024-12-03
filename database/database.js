const sequelize = require('sequelize')

const connection = new sequelize('perguntas_node', 'root', '12345678', 
{
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection
