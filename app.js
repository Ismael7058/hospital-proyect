const express = require("express");
const app = express();
const path = require("path");

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "view"));
app.use(express.static(path.join(__dirname, "public")));


const homeRouter = require("./router/homeRouter");
const medicoRouter = require('./router/medicoRouter');
const recepcionRouter = require('./router/recepcionRouter')
const enfermeroRouter = require('./router/enfermeroRouter')
app.use('/', homeRouter);
app.use('/medico', medicoRouter);
app.use('/recepcion', recepcionRouter);
app.use('/enfermero', enfermeroRouter);


app.use((req, res)=>{
  res.status(404).render('error')
});



app.set("port", process.env.PORT || 3030);

module.exports = app;

