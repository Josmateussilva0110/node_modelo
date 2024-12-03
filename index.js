const express = require("express")
const body_parser = require("body-parser")
const connection = require("./database/database")
const pergunta_model = require("./database/Pergunta")

const app = express()


connection.authenticate().then(() => {
    console.log('conexão feita com sucesso.')
}).catch((err) => {
    console.log('erro na conexão com o banco. ' + err)
})
 
app.set('view engine', 'ejs')
app.use(express.static('public'))


app.use(body_parser.urlencoded({extended: false}))
app.use(body_parser.json())

app.get("/home", (request, response) => {
    pergunta_model.findAll({raw: true, order: [
        ['id', 'DESC'] //ordenação
    ]}).then(perguntas => {
        response.render("index", {
            perguntas: perguntas
        })
    })
})


app.get("/", (request, response) => {
    response.render("perguntar")
})


app.post("/salvar_dados", (request, response) => {
    var titulo = request.body.titulo
    var descricao = request.body.descricao
    pergunta_model.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        response.redirect("home")
    })
})


app.get("/pergunta/:id", (request, response) => {
    var id = request.params.id 
    pergunta_model.findOne({where: {id: id}}).then(pergunta => {
        if(pergunta != undefined)
            response.render("detalhe_pergunta", {pergunta: pergunta})
        else
            response.redirect("/home")
    })
})


app.listen(8080, () => {
    console.log("App rodando.")
})  