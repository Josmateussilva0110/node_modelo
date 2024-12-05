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


app.get("/editar_pergunta/:id", (request, response) => {
    var id = request.params.id 
    pergunta_model.findOne({where: {id: id}}).then(pergunta => {
        if(pergunta)
            response.render("editar_pergunta", {pergunta: pergunta})
        else
            response.render("/home")
    }).catch(err => {
        console.error("erro ao buscar pergunta: ", err)
        response.redirect("/home")
    })
})


app.get("/pergunta/:id", (request, response) => {
    var id = request.params.id 
    pergunta_model.findOne({where: {id: id}}).then(pergunta => {
        if(pergunta != undefined)
            response.render("detalhe_pergunta", {pergunta: pergunta, id: id})
        else
            response.redirect("/home")
    })
})

app.post("/editar/:id", (request, response) => {
    const id = request.params.id
    const { titulo, descricao } = request.body

    pergunta_model.update(
        { titulo: titulo, descricao: descricao },
        { where: { id: id } }
    ).then(() => {
        response.redirect("/home")
    }).catch(err => {
        console.error("Erro ao atualizar a pergunta:", err);
        response.redirect("/editar/" + id)
    })
})


app.listen(8080, () => {
    console.log("App rodando.")
})  