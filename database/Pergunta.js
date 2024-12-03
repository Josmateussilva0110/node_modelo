const sequelize = require("sequelize")
const connection = require("./database")

const Pergunta = connection.define('pergunta', {
    titulo: {
        type: sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: sequelize.TEXT
    }
})

Pergunta.sync({force: false}).then(() => {
    console.log('tabela criada com sucesso.')
}).catch((err) => {
    console.log('erro ao criar a tabela ' + err)
})


module.exports = Pergunta