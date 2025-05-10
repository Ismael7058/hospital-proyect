const express = require("express");
const app = express();
const path = require("path");

const homeRouter = require("./router/homeRouter");

app.use('/', homeRouter);

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "view"));


app.set("port", process.env.PORT || 3030);

module.exports = app

