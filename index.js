const { Console } = require("console");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const AppointmentService = require("./services/AppointmentService");
const appointmentService = require("./services/AppointmentService");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/agendamento", { useNewUrlParser: true, useUnifiedTopology: true });

//Route GAT
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/cadastro", (req, res) => {
    res.render("create");
});

app.get("/getcalendar", async (req, res) => {
    let appointments = await AppointmentService.GetAll(false);
    res.json(appointments);
});

app.get("/event/:id", async (req, res) => {
    let appointment = await AppointmentService.GetById(req.params.id);
    res.render("event",{appo: appointment});
});

app.get("/list", async (req,res) =>{

    //await AppointmentService.Search("104.131.995-92")

    let appos = await AppointmentService.GetAll(true);
    res.render("list", {appos});
});

app.get("/searchresult", async (req,res)=>{
    let appos = await AppointmentService.Search(req.query.search);
    res.render("list", {appos});
})

//Route POST
app.post("/create", async (req, res) => {
    let status = await appointmentService.Create(
        req.body.name,
        req.body.email,
        req.body.cpf,
        req.body.description,
        req.body.date,
        req.body.time,
    )
    if (status) {
        res.redirect("/");
    } else {
        res.send("Falha no cadastro!");
    }
});

app.post("/finish", async (req,res) => {
    let id = req.body.id;
    let result = await AppointmentService.Finish(id);

    res.redirect("/");

});

app.listen(8080, () => { console.log("App rodando!") });